$(() => {
	const URL = '/space';
	const TYPES_OF_SPACE_OBJS = [
		'Звезда',
		'Планета',
		'Спутник планеты',
		'Метеороид',
		'Метеор',
		'Комета',
		'Астероид'
	];

	function getSpaceObjType(typeId) {
		return TYPES_OF_SPACE_OBJS[typeId - 1];
	}

	let get = (url, fn) => {
		$.ajax({
			url: url,
			method: 'GET',
			dataType: 'json',
			success: response => fn(response)
		});
	}
	let add = (url, data, fn) => {
		$.ajax({
			url: url,
			method: 'POST',
			dataType: 'json',
			data: {
				name: data.name,
				type: data.type
			},
			success: response => fn(response)
		});
	};
	let edit = (url, data, fn) => {
		$.ajax({
			url: url,
			method: 'PUT',
			dataType: 'json',
			data: {
				id: data.id,
				name: data.name,
				type: data.type
			},
			success: response => fn(response)
		});
	};
	let del = (url, data, fn) => {
		$.ajax({
			url: url,
			method: 'DELETE',
			dataType: 'json',
			data: {
				id: data.id
			},
			success: response => fn(response)
		});
	};

	function getSuccess(res) {
		let html = '<tr><th>Name</th><th>Type</th><th>Action</th></tr>';
		res.forEach(elem => {
			html += `<tr data-id="${elem.id}"><td>${elem.name}</td><td>${getSpaceObjType(elem.type)}</td><td><button class="btn btn-primary editBtn" data-id="${elem.id}" data-toggle="popover">Edit</button> <button class="btn btn-primary deleteBtn" data-id="${elem.id}">Delete</button></td></tr>`;
		});
		$('#table').html(html);
	}
	function postSuccess(res) {
		let html = `<tr data-id=${res.id}><td>${res.name}</td><td>${getSpaceObjType(res.type)}</td><td><button class="btn btn-primary editBtn" data-toggle="popover">Edit</button> <button class="btn btn-primary deleteBtn">Delete</button></td></tr>`;
		$('#table').append(html);
		console.log(res);
	}
	function putSuccess(res) {
		let tr = $('#table').find(`tr[data-id=${res.id}]`)[0];
		tr.children[0].innerText = res.name;
		tr.children[1].innerText = getSpaceObjType(res.type);
		console.log(res);
	}
	function deleteSuccess(res) {
		$('#table').find(`tr[data-id=${res.id}]`)[0].remove();
		console.log(res);
	}

	get(URL, getSuccess);

	$('#formAdd').on('submit', (e) => {
		let data = {
			name: $('#nameAddBox').val(),
			type: $('#typeAddBox').val()
		};
		$('#formAdd')[0].reset();

		e.preventDefault();
		add(URL, data, postSuccess);
	});

	$(document).popover({
		trigger: 'click',
		selector: '.editBtn',
		placement: "top",
		html: true,
		content: `
			<form class="form" id="formEdit">
				<input class="form-control mb-2" name="name" id="nameEditBox" placeholder="Input name" required>
				<select class="form-control mb-2" name="type" id="typeEditBox" required>
					<option value="1">Звезда</option>
					<option value="2">Планета</option>
					<option value="3">Спутник планеты</option>
					<option value="4">Метеороид</option>
					<option value="5">Метеор</option>
					<option value="6">Комета</option>
					<option value="7">Астероид</option>
				</select>
				<button type="submit" class="btn btn-primary confirmEditBtn" id="confirmEditBtn">OK</button>
				<button type="reset" class="btn btn-primary">Clear</button>
			</form>
		`
	});
	$(document).on('click', '.editBtn', (e) => {
		$('.editBtn').not(e.target).popover('dispose');

		let tr = e.target.parentElement.parentElement;
		let id = tr.dataset.id;
		let name = tr.children[0].innerText;
		let type = tr.children[1].innerText;

		if (!$('#nameEditBox').val()) $('#nameEditBox').val(name);
		let optionsList = $('#typeEditBox')[0].children;
		$(optionsList).each((i, el) => {
			if (el.innerText === type) $(el).attr('selected', true);
		});
	});
	$(document).on('submit', '#formEdit', (e) => {
		e.preventDefault();

		let popoverId = e.target.parentElement.parentElement.id;
		let callBtn = $(`[aria-describedby=${popoverId}]`)[0];
		let tr = callBtn.parentElement.parentElement;

		let data = {
			id: tr.dataset.id,
			name: $('#nameEditBox').val(),
			type: $('#typeEditBox').val()
		};

		let name = tr.children[0].innerText;
		let type = tr.children[1].innerText;

		if (name !== data.name || type !== getSpaceObjType(data.type)) edit(URL, data, putSuccess);
		$(callBtn).popover('dispose');
	});
	$(document).on('click', '.deleteBtn', (e) => {
		let tr = e.target.parentElement.parentElement;
		let data = { id: tr.dataset.id };
		let isConfirmed = confirm('Are you sure you want to delete this row [ID: ' + data.id + ']?');
		if (isConfirmed) del(URL, data, deleteSuccess);
	});
});