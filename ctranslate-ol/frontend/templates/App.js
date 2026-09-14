var init = function() {
	var input_box  = document.querySelector("#input-box");
	var output_box = document.querySelector("#output-box");
	var inlang  = document.querySelector("#inlang");
	var outlang = document.querySelector("#outlang");
	let swaplang_button = document.querySelector("#swaplang-button");
	let translate_button = document.querySelector("#translate-button");
	let clear_button = document.querySelector("#clear-button");
	let dropdown_button = document.querySelector("#dropdown-button");
	let spell_toggle = document.querySelector("#spellcheck-toggle");
	let showbreak_toggle = document.querySelector("#showbreak-toggle");
	let download = document.querySelector("#download");
	let dropdownMenu = document.querySelector('.dropdown-menu');
	let isSyncingLeftScroll  = false;
	let isSyncingRightScroll = false;
	var box_data = { "in_text": [], "out_text": [], "unks": [], "used_model": "" };

	let info = JSON.parse('{{info}}');
	let models = info.models.sort((a, b) => new Date(b.traindate) - new Date(a.traindate));
	let directions = [...new Set(info.models.flatMap(m => m.directions))];
	let langs = [...new Set(directions.flatMap(d => d.split("_")))];
	let selectedModel = null;

	clear_button.onclick = function() {
		input_box.innerText = '';
		output_box.innerText = '';
		input_box.onkeyup();
	}

	let input_box_events = function(event) {
		let from = inlang.value;
		if(this.textContent.length == 0) {
			inlang.querySelector('option[value="neutral"]').selected = true;
			translate_button.disabled = true;
			dropdown_button.disabled = true;
		}

		if(!from == "neutral") return;
		guessLanguage.detect(this.textContent, function(lang) {
			//console.log('Textlänge: ' + input_box.textContent.length + ' Language code: ' + lang);
			if (langs.includes(lang)) {
				inlang.querySelector(`option[value="${lang}"]`).selected = true;
				inlang.onchange();
			}
		});

		if(output_box.textContent.length > 0 && event.type === "keyup" && (event.code === 'Enter' || event.code.startsWith('Key'))) {
			//input_box.innerText = input_box.innerText;
			output_box.innerText = '';
		}
	}

	input_box.addEventListener("keyup", input_box_events);
	input_box.addEventListener("click", input_box_events);

	var mouse_handler = function(event) {
		in_snts  = input_box.querySelectorAll('.snt');
		out_snts = output_box.querySelectorAll('.snt');

		in_snts.forEach(function(snt)  { snt.classList.remove('hl'); });
		out_snts.forEach(function(snt) { snt.classList.remove('hl'); });

		if(event.target.classList.contains('snt')) {
			i = event.target.getAttribute('i');
			in_snts[i].classList.add('hl');
			if(out_snts.length) out_snts[i].classList.add('hl');
		}
	}

	input_box.addEventListener("mouseover", mouse_handler);
	output_box.addEventListener("mouseover", mouse_handler);

	input_box.onscroll = function() {
		if (!isSyncingLeftScroll) {
			isSyncingRightScroll = true;
			output_box.scrollTop = this.scrollTop;
		}
		isSyncingLeftScroll = false;
	}

	output_box.onscroll = function() {
		if (!isSyncingRightScroll) {
			isSyncingLeftScroll = true;
			input_box.scrollTop = this.scrollTop;
		}
		isSyncingRightScroll = false;
	}

	inlang.onchange = function() {
		let from = this.value;
		if(from == "neutral") {
			input_box.onkeyup()
			translate_button.classList.add('disabled');
			return;
		}

		// Gibt es Zielsprachen, für welche die aktuelle Quellsprache kein Modell hat (vermerkt im Attribut notto)?
		let notto = this.querySelector(`option[value="${from}"]`).getAttribute("notto");

		// Alle Zielsprachen deaktivieren, die entweder gleich der Eingabesprache oder ohne Modell sind
		outlang.querySelectorAll("option").forEach(function(option) {
			option.disabled = option.value == from || option.value == notto;
		})

		// Wenn die Ausgabesprache noch gleich der aktuellen Eingabesprache sein sollte, wähle die erstmögliche Option
		if(outlang.value == from)
			Array.from(outlang.options).filter(option => !option.disabled)[0].selected = true;

		translate_button.disabled = false;
		dropdown_button.disabled = false;
	}

	// Option auswählen
	dropdownMenu.addEventListener("click", e => {
		if (e.target.tagName === "LI") {
			selectedModel = e.target.getAttribute("value");
			dropdownMenu.style.display = 'none';
			translate_button.onclick();
		};
	});

	dropdown_button.addEventListener('click', (e) => {
		e.preventDefault();
		dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
		let availableModels = models.filter(m => m.directions.includes(inlang.value + "_" + outlang.value));
		if (!availableModels.some(m => m.name === selectedModel)) {	selectedModel = availableModels[0].name; }
		dropdownMenu.innerHTML = availableModels
			.map(m => `<li value="${m.name}" class="${m.name === selectedModel ? 'selected' : ''}">${m.name}</li>`)
			.join("");
	});

	var createSentSpan = function(text, index) {
		var snt = document.createElement('span');
		snt.classList.add('snt');
		snt.textContent = text;
		snt.setAttribute('i', index);
		return snt;
	}

	swaplang_button.onclick = function() {
		console.log(output_box.innerText.split('\n\n').length);
		input_box.innerText = output_box.innerText.split('\n\n').join('\n');
		let srclang = inlang.value;
		inlang.value = outlang.value;
		outlang.value = srclang;
		translate_button.onclick();
	}

	translate_button.onclick = function() {
		output_box.innerText = '';
		spell_toggle.checked = false; spell_toggle.onchange();
		showbreak_toggle.checked = false; showbreak_toggle.onchange();

		let text = input_box.innerText;

		if (!text.length || inlang.value == "neutral")
			return;

		this.classList.add('blink');
		let unk = this.getAttribute("unk");

		fetch("./translate", {
			method: 'POST',
			body: JSON.stringify({ "model": selectedModel, "source_language": inlang.value, "target_language": outlang.value, "text": text }),
			headers: { 'Content-Type': 'application/json' }
		})
		.then(response => response.json())
		.then(data => {
			box_data["in_text"] = data["marked_input"];
			box_data["out_text"] = data["marked_translation"];
			box_data["unks"] = data["unks"];
			box_data["used_model"] = data["model"];
			input_box.innerHTML = '';
			output_box.innerHTML = '';
			let s_nr = 0;
			for(let p_idx=0; p_idx<box_data["in_text"].length; p_idx++) {
				let in_l  = box_data["in_text"][p_idx];
				let out_l = box_data["out_text"][p_idx];
				let in_p  = document.createElement('p'); in_p.setAttribute("contenteditable", "plaintext-only");
				let out_p = document.createElement('p');
				for(var s_idx=0; s_idx<in_l.length; s_idx++) {
					in_p.appendChild(createSentSpan(in_l[s_idx], s_nr));
					out_p.appendChild(createSentSpan(out_l[s_idx], s_nr));
					if(s_idx < in_l.length-1) {
						in_p.appendChild(document.createTextNode(" "));
						out_p.appendChild(document.createTextNode(" "));
					}
					s_nr++;
				}
				input_box.appendChild(in_p);
				output_box.appendChild(out_p);
			}

			syncCellsHeight();
			input_box.scrollTop = 0;

			box_data["unks"].forEach(function(word) {
				if(word === '|') return;
				let replacePattern = new RegExp(`(?<!\\p{L})(${word})(?!\\p{L})`, 'gu');
				document.querySelectorAll('.snt').forEach(function(snt) {
					snt.innerHTML = snt.innerHTML.replace(replacePattern, `<span class="unk" title="${unk}">${word}</span>`);
				});
			})

			translate_button.classList.remove('blink');
			showbreak_toggle.onchange();
		})
		.catch(error => {
			console.error(error);
			translate_button.classList.remove('blink');
		});
	}

	download.onchange = function() {
		if(output_box.innerText.length == 0)
			return;
		download.classList.add('blink');
		let option = this.value;
		fetch('./download', {
			method: 'POST',
			body: JSON.stringify({ "option": option, "from": inlang.value, "to": outlang.value, "box_data": box_data }),
			headers: { 'Content-Type': 'application/json' }
		})
		.then(response => { console.log(response.headers.get('Content-Disposition')); return response.blob(); })
		.then(blob => {
			var jetzt = new Date();
			const link = document.createElement('a');
			const pad = (n,s=2) => (`${new Array(s).fill(0)}${n}`).slice(-s);
			link.href = URL.createObjectURL(blob);
			link.setAttribute('download', `${this.getAttribute('fname')}_${jetzt.getFullYear()}-${pad(jetzt.getMonth()+1)}-${pad(jetzt.getDate())}_${pad(jetzt.getHours())}${pad(jetzt.getMinutes())}${pad(jetzt.getSeconds())}.docx`);
			document.body.appendChild(link);
			link.click();
			download.classList.remove('blink');
		})
		.catch(error => {
			console.error(error);
			translate_button.classList.remove('blink');
		});
		this.value = '';
	}

	let syncCellsHeight = function() {
		const inCells  = input_box.querySelectorAll('p');
		const outCells = output_box.querySelectorAll('p');

		for(i=0; i<inCells.length; i++) {
			inCells[i].style.height  = 'auto';
			outCells[i].style.height = 'auto';
			cellMaxHeight = Math.max(inCells[i].clientHeight, outCells[i].clientHeight);
			inCells[i].style.height  = cellMaxHeight + 'px';
			outCells[i].style.height = cellMaxHeight + 'px';
		}
	}
	window.addEventListener('resize', syncCellsHeight);

	let remove_spans = function() {
		document.querySelectorAll("span[title]").forEach(function(span) {
			span.replaceWith(document.createTextNode(span.innerText));
		});
	}

	let spellcheck = function(elem, lang) {
		const findPattern = new RegExp('[^' + '\\s!"#$%&()*+,-./:;<=>?@[\\]^_{|}`–' + '§©«®±¶·¸»¼½¾¿×÷¤”“„' + '\xA0\u2002\u2003\u2009' + ']+', 'g');
		/* /[^\s!"#$%&()*+,-./:;<=>?@[\]^_{|}`§©«®±¶·¸»¼½¾¿×÷¤”“„    ]+/g */
		let words = elem.innerText.match(findPattern);
		if(!words)
			return;

		fetch('./spell', {
			method: 'POST',
			body: JSON.stringify({ "lang": lang, "words": words }),
			headers: { 'Content-Type': 'application/json' }
		})
		.then(response => response.json())
		.then(data => {
			for (const word in data) {
				let replacePattern = new RegExp(`(?<!\\p{L})(${word})(?!\\p{L})`, 'gu');
				elem.innerHTML = elem.innerHTML.replace(replacePattern, `<span class="spell" title="${data[word]}">${word}</span>`);
			}
		})
		.catch(error => console.error(error));
	}

	spell_toggle.onchange = function() {
		remove_spans();
		if(this.checked) {
			spellcheck(input_box, inlang.value);
			spellcheck(output_box, outlang.value);
		}
	}

	showbreak_toggle.onchange = function() {
		var paragraphs = document.querySelectorAll('p');
		if(this.checked)
			paragraphs.forEach(function(p) { p.classList.add('marker'); });
		else
			paragraphs.forEach(function(p) { p.classList.remove('marker'); });
	}

	/* let generateUUID = function() {
		let arr = new Uint8Array(16);
		crypto.getRandomValues(arr);
		arr[6] = (arr[6] & 0x0f) | 0x40;
		arr[8] = (arr[8] & 0x3f) | 0x80;
		let hexArr = [];
		for (let i = 0; i < arr.length; i++)
			hexArr.push(arr[i].toString(16).padStart(2, '0'));
		return hexArr.slice(0, 4).join('') + '-' + hexArr.slice(4, 6).join('') + '-' + hexArr.slice(6, 8).join('') + '-' + hexArr.slice(8, 10).join('') + '-' + hexArr.slice(10).join('');
	}

	const uuid = generateUUID();
	console.log(uuid); */

} // init()
