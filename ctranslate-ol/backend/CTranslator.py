# -*- coding: utf-8 -*-

import os, sys, string
from ruamel.yaml import YAML

os.environ["MKL_CBWR"] = "AUTO,STRICT" # Batchtranslations sollen nicht von der Übersetzung einzelner Sätze abweichen

def eprint(*args, **kwargs):
	print(*args, file=sys.stderr, **kwargs)

def set_version(vstore):
	import datetime
	version = open(vstore, 'r').readline()
	v_num, v_date = version.split()
	f_date = str(datetime.datetime.fromtimestamp(os.stat(__file__).st_mtime)).split()[0]
	if not v_date == f_date:
		major, minor = v_num.rsplit('.', 1)
		version = f'{major}.{int(minor) + 1} {f_date}'
		with open(vstore, 'w') as f: f.write(version)
	return version

from urlextract import URLExtract
extractor = URLExtract()
for pair in '„“|‚‘|()| .| ?| !| ,| )'.split('|'):
	extractor.add_enclosure(*pair)

QUOTES = '''„“‚‘»«›‹”’'''
_SPLIT_MASK_TABLE = str.maketrans(QUOTES, '"' * len(QUOTES))

import re
EMOJI_PATTERN = (
	r"[\U0001F600-\U0001F64F]|" # emoticons
	r"[\U0001F300-\U0001F5FF]|" # symbols & pictographs
	r"[\U0001F680-\U0001F6FF]|" # transport & map symbols
	r"[\U0001F1E0-\U0001F1FF]|" # flags (iOS)
	r"[\U0001f926-\U0001f937]|"
	r"[\U00010000-\U0010ffff]"
)
MAIL_PATTERN    = r"[A-zěłó0-9\.\-+_]+@[A-z0-9\.\-+_]+\.[A-z]+"
HASHTAG_PATTERN = r"#[^ !@#$%^&*(),.?\":{}|<>“]+"

PH_MARK = '⟦⟧' # MATHEMATICAL SQUARE BRACKETS (U+27E6, Ps): ⟦; (U+27E7, Pe): ⟧

# Funktion zum Setzen der NE-Marker
# gibt mit Platzhaltern versehenen Satz und Rückübersetzungsinformation zurück
def set_markers(sentence):
	urls = extractor.find_urls(sentence)

	# Alle Muster zusammenfügen
	patterns = [MAIL_PATTERN, HASHTAG_PATTERN, EMOJI_PATTERN]
	if urls:
		# Längste URLs zuerst sortieren, um Teil-Treffer zu vermeiden
		patterns.append("|".join([re.escape(u) for u in sorted(urls, key=len, reverse=True)]))

	full_pattern = "|".join(patterns)

	return re.sub(full_pattern, PH_MARK, sentence), re.findall(full_pattern, sentence)

def remove_markers(sentence, maps):
	for map in maps:
		sentence = sentence.replace(PH_MARK, map, 1)
	return sentence

teststring = 'Abo sće hižo raz wo wužiwanju „dźěćacych pytanskich mašinow“ kaž blinde-kuh.de a fragFINN.de pod sylko.freudenberg@stadt.kamenz.de přemyslował/a?'
try:
	assert \
		set_markers(teststring) \
		== \
		('Abo sće hižo raz wo wužiwanju „dźěćacych pytanskich mašinow“ kaž ⟦⟧ a ⟦⟧ pod ⟦⟧ přemyslował/a?', ['blinde-kuh.de', 'fragFINN.de', 'sylko.freudenberg@stadt.kamenz.de'])

except AssertionError as e:
	eprint('Platzhalter passen nicht!')
	eprint(set_markers(teststring))
	sys.exit(1)

import ctranslate2, logging, unicodedata
ctranslate2.set_log_level(logging.INFO)
#('off', 'critical', 'error', 'warning (default)', 'info', 'debug', 'trace')

import youtokentome as yttm
import sentencepiece as spm

from sentence_splitter import SentenceSplitter

# in version.txt kann man nach Belieben eine Versionsnummer nach dem Muster des Beschreibungs-Dokuments setzen.
# Die letzte(n) Stelle(n) der Versionsnummer und das Datum pflegen sich automatisch
webservice_version = set_version('version.txt')
modelpath = 'models'
sp = spm.SentencePieceProcessor()

class model:
	def __init__(self, location):
		path = modelpath + '/' + location
		self.info = YAML().load(open(path + '/model_info.yaml'))
		self.translator = ctranslate2.Translator(path, device="cpu")
		if os.path.exists(path + '/codes-yttm'):
			self.encode = lambda sentence: yttm.BPE(model=path + '/codes-yttm').encode(sentence, output_type=yttm.OutputType.SUBWORD)
			self.decode = lambda tokens: ''.join(tokens).replace('▁', ' ').strip()
		if os.path.exists(path + '/sp.model'):
			sp.load(path + '/sp.model')
			self.encode = lambda sentence: sp.encode(sentence, out_type=str)
			self.decode = lambda tokens: sp.decode(tokens)
		if self.info.get('ext'): self.vocabs = set(open(path + '/train_vocabulary.txt', encoding='utf-8').read().split('\n'))
		self.sentence_splitters = dict()
		for lang in set(sum([dir.split('_') for dir in self.info.get('directions', [])], [])):
			nbp_file = 'nonbreaking_prefixes/nonbreaking_prefix.' + lang
			self.sentence_splitters[lang] = SentenceSplitter(language='xx', non_breaking_prefix_file=nbp_file) if os.path.exists(nbp_file) else SentenceSplitter(language=lang)

	def s_split(self, lang, text):
		text_ = text.translate(_SPLIT_MASK_TABLE)
		splitted = self.sentence_splitters[lang].split(text_)
		indices = []
		pos = 0
		for part in splitted:
			start = text_.find(part, pos)
			end = start + len(part)
			indices.append((start, end))
			pos = end

		return [text[s:e] for s, e in indices]

	def s_translate(self, sentences, tgt, ext):
		# not (s[-1] in string.punctuation + '…') for s in sentences # performanter, aber weniger Umfang
		fakeperiods = [i for i, s in enumerate(sentences) if unicodedata.category(s[-1])[0] != "P"]
		for i in fakeperiods: sentences[i] += '.'
		if ext:
			sentences, maplists = zip(*(set_markers(s) for s in sentences))
		tok_sentences = [[f"<{tgt}>"] + self.encode(s) for s in sentences]
		results = self.translator.translate_batch(tok_sentences, replace_unknowns=False, return_scores=False) # repetition_penalty=2
		translations = [self.decode(r.hypotheses[0]) for r in results]
		vocabs = get_words(' '.join(list(sentences) + translations))
		if ext:
			for i, t in enumerate(translations): translations[i] = remove_markers(t, maplists[i])
		for i in fakeperiods: translations[i] = translations[i][:-1]
		return [t.translate({8263: None, 10214: None, 10215: None}) for t in translations], vocabs

all_models = [model(dir) for dir in os.listdir(modelpath) if os.path.isdir(modelpath + '/' + dir)]
all_models.sort(key=lambda m: m.info.get('traindate'), reverse=True)
valid_directions = set(direction for m in all_models for direction in m.info.get('directions', []))
valid_sources, valid_targets = map(set, zip(*(dir.split('_') for dir in valid_directions)))

_TRANSLATION_TABLE = {
    ord('\u00A0'): ' ',   # NO-BREAK SPACE
    ord('\u00AD'): None,  # SOFT HYPHEN
    ord('\u200B'): None,  # ZERO WIDTH SPACE
    ord('\r'): None,
}

_WHITESPACE_RE = re.compile(r"[ \t]+")

def prepareTranslationInputText(text):
	text = text.translate(_TRANSLATION_TABLE)
	text = unicodedata.normalize("NFKC", text)
	text = _WHITESPACE_RE.sub(" ", text)
	return text.replace(" \n", "\n")

ignore_chars = string.punctuation + QUOTES + '–'
_CLEAN_TABLE = str.maketrans(ignore_chars, " " * len(ignore_chars))

def get_words(sentence):
	return set(
		token for token in sentence.translate(_CLEAN_TABLE).split()	if not token.isnumeric()
	)

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
app.config["DEBUG"] = False
CORS(app)

@app.route('/translate', methods=['POST'])
def translate_text():
	reqdata = request.get_json()
	wrong_params = set(reqdata.keys()) - {'source_language', 'target_language', 'model', 'text', 'debug'}
	if wrong_params: return { "errormsg": f'wrong parameter{"s" if len(wrong_params)>1 else ""} {" ".join(wrong_params)}' }

	src = reqdata.get('source_language')
	if src is None: return { "errormsg": 'missing source language' }
	if not src in valid_sources: return { "errormsg": f'{src} is not a valid source language' }

	tgt = reqdata.get('target_language')
	if tgt is None: return { "errormsg": 'missing target language' }
	if not tgt in valid_targets: return { "errormsg": f'{tgt} is not a valid target language' }

	direction = src + '_' + tgt
	if not direction in valid_directions: return { "errormsg": f'translations from {src} to {tgt} are not supported' }

	modelname = reqdata.get('model')
	if modelname is None:
		m = next((m for m in all_models if direction in m.info.get('directions', [])), None)
	else:
		m = next((m for m in all_models if modelname == m.info.get('name')), None)

	if m is None: return { "errormsg": f'model {modelname} is not available' }
	if not direction in m.info.get('directions', []): return { "errormsg": f"wrong combination: model {modelname} doesn't support direction {direction}" }

	text = reqdata.get('text')

	if text is None or len(str(text)) == 0: return { "errormsg": 'nothing to do' }
	if not type(text) is str: return { "errormsg": f"'text': wrong type {type(text)}" }

	debug = reqdata.get('debug')
	if debug is not None:
		if not type(debug) is bool : return { "errormsg": f"'debug': you specified {debug} ({type(debug)}) but 'debug' should be true or false" }
		if debug: return { "errormsg": "content for option 'debug' not specified => no operation so far" }

	input = [m.s_split(src, line) if len(line) else [] for line in prepareTranslationInputText(text).rstrip().split('\n')]

	output, vocabs, ext = [], set(), m.info.get('ext')

	for p in input:
		x, y = m.s_translate(p.copy(), tgt, ext) if p else ([], set())
		output.append(x)
		vocabs.update(y)

	return {
		"marked_input": input,
		"marked_translation": output,
		"model": m.info.get('name'),
		"unks": list(vocabs-m.vocabs) if ext else []
	}

@app.route('/info', methods=['GET'])
def info():
	output = "name", "directions", "traindate", "BLEU_score"
	return jsonify({ "webservice_version": webservice_version, "models": [{item: m.info.get(item) for item in output} for m in all_models] })

if __name__ == '__main__':
	# app.run('0.0.0.0', 5000, ssl_context='adhoc')
	from waitress import serve
	serve(app, host="0.0.0.0", port=5000)
