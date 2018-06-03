$(() => {
	var get = () => {
		$.ajax({
			url: '/space',
			method: 'GET',
			dataType: 'json',
			success: data => {
				console.log('GET');
				var html = '<tr><th>ID</th><th>Name</th><th>Type</th></tr>';
				data.forEach(elem => {
					html += `<tr><th>${elem.id}</th><td>${elem.name}</td><td>${elem.type}</td></tr>`;
				});
				$('#table').html(html);
			}
		});
	}

	var head = () => {
		$.ajax({
			url: '/space',
			method: 'HEAD',
			dataType: 'json',
			success: data => {
				console.log('HEAD');
				var html = '<tr><th>ID</th><th>Name</th><th>Type</th></tr>';
				data.forEach(elem => {
					html += `<tr><th>${elem.id}</th><td>${elem.name}</td><td>${elem.type}</td></tr>`;
				});
				$('#table').html(html);
			}
		});
	}

	var add = () => {
		$.ajax({
			url: '/space',
			method: 'POST',
			dataType: 'json',
			data: {
				name: $('#nameAddBox').val(),
				type: $('#typeAddBox').val()
			},
			success: data => {
				console.log('INSERT');
				if (data.success) {
					$('#nameAddBox').val('');
					$('#typeAddBox').val('');
					get();
				}
			}
		});
	};

	var edit = () => {
		$.ajax({
			url: '/space',
			method: 'PUT',
			dataType: 'json',
			data: {
				id: $('#idEditBox').val(),
				name: $('#nameEditBox').val(),
				type: $('#typeEditBox').val()
			},
			success: data => {
				console.log('UPDATE');
				if (data.success) {
					$('#idEditBox').val('');
					$('#nameEditBox').val('');
					$('#typeEditBox').val('');
					get();
				}
			}
		});
	};

	var del = () => {
		$.ajax({
			url: '/space',
			method: 'DELETE',
			dataType: 'json',
			data: {
				id: $('#idDeleteBox').val()
			},
			success: data => {
				console.log('DELETE');
				if (data.success) {
					$('#idDeleteBox').val('');
					get();
				}
			}
		});
	};

	get();
	$('#addBtn').click(add);
	$('#editBtn').click(edit);
	$('#deleteBtn').click(del);
});