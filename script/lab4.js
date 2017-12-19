const masterKey = "bQ1ry";
let errorCounter = 0;
let errorMessage;
let tabAdd = document.getElementById("tabAdd");
let tabView = document.getElementById("tabView");
let tabError = document.getElementById("tabError");
let add = document.getElementById("add");
let api = document.getElementById("api");
let view = document.getElementById("view");
let google = document.getElementById("google");
let errors = document.getElementById("errors");
let addBookTitle = document.getElementById("addBookTitle");
let addBookAuthor = document.getElementById("addBookAuthor");
let addBtn = document.getElementById("addBtn");
let viewBooks = document.getElementById("viewBooks");
let viewBtn = document.getElementById("viewBtn");
let editBtn = document.getElementById("editBtn");
let delBtn = document.getElementById("delBtn");
let key = document.getElementById("keyText");
let keyBtn = document.getElementById("keyBtn");
let viewGoogle = document.getElementById("viewGoogle");
let googleSrh = document.getElementById("googleSrh");
let googleSrhBtn = document.getElementById("googleSrhBtn");
let googleAddBtn = document.getElementById("googleAddBtn");
let errorPara = document.getElementById("errorPara");
let showErrCnt = document.getElementById("showErrCnt");
let msgBox = document.createElement("div");

function showMessage(status, message, section){
	msgBox.className = "messageBox";
	section.appendChild(msgBox);
	addBtn.disabled = true;
	viewBtn.disabled = true;
	delBtn.disabled = true;
	if(status === "error"){
		msgBox.innerText = "Error, try again";
		errorCounter++;
		errorPara.innerText = message;
		showErrCnt.innerText = errorCounter;
	}
	else{
		msgBox.innerText = "Success";
	}
}

tabAdd.addEventListener("click", function(){
	tabAdd.className = "marked";
	tabView.className = "";
	tabError.className = "";
	api.className = "show";
	add.className = "show";
	view.className = "noShow";
	google.className = "noShow";
	errors.className = "noShow";
})

tabView.addEventListener("click", function(){
	tabAdd.className = "";
	tabView.className = "marked";
	tabError.className = "";
	api.className = "noShow";
	add.className = "noShow";
	view.className = "show";
	google.className = "show";
	errors.className = "noShow";
})

tabError.addEventListener("click", function(){
	tabAdd.className = "";
	tabView.className = "";
	tabError.className = "marked";
	api.className = "noShow";
	add.className = "noShow";
	view.className = "noShow";
	google.className = "noShow";
	errors.className = "show";
})

keyBtn.addEventListener("click", function(){
	fetch("https://www.forverkliga.se/JavaScript/api/crud.php?requestKey")
	.then(function(response){
		return response.json();
	})
	.then(function(keyNr){
		//console.log(keyNr);
		key.value = keyNr.key;
	})
})

addBtn.addEventListener("click", function(){
	fetch(`https://www.forverkliga.se/JavaScript/api/crud.php?op=insert&key=${masterKey}&title=${addBookTitle.value}&author=${addBookAuthor.value}`)
	.then(function(response){
		return response.json();
	})
	.then(function(addB){
		console.log(addB);
		if(addB.status === "error"){
			showMessage(addB.status, addB.message, add);
			setTimeout(() => {
				add.removeChild(msgBox);
				addBtn.disabled = false;
				viewBtn.disabled = false;
				delBtn.disabled = false;
			}, 3000);
			//alert(`Something went wrong: ${add.message}`);
		}
		else{
			addBtn.disabled = true;
			showMessage(addB.status, "", add);
			setTimeout(() => {
				add.removeChild(msgBox);
				addBtn.disabled = false;
				viewBtn.disabled = false;
				delBtn.disabled = false;
			}, 3000);
			//alert("The book has been added");
		}
		
	})
})

viewBtn.addEventListener("click", function(){
	fetch(`https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key=${masterKey}`)
	.then(function (response){
		return response.json();
	})
	.then(function(viewB){
		
		if(viewB.status === "error"){
			
			showMessage(viewB.status, viewB.message, view);
			setTimeout(() => {

				view.removeChild(msgBox);
				addBtn.disabled = false;
				viewBtn.disabled = false;
				delBtn.disabled = false;
			}, 2000);

			//alert(`Something went wrong: ${view.message}`);
		}
		else{
			viewBooks.innerHTML = "";
			viewB.data.forEach(function(book){
				let newOption = document.createElement("option");
				newOption.value = book.id;
				newOption.innerText = book.title + " <> " + book.author;
				viewBooks.appendChild(newOption);
				console.log(book);
				console.log(view.data);
				console.log("Book title: " + book.title);
				//viewBooks.innerHTML += book.title +" by " + book.author + "<br>";
			})
		}
	});
});

delBtn.addEventListener("click", function(event){
	if(viewBooks.options[viewBooks.selectedIndex] === undefined) event.preventDefault();
	else{
		let delId = viewBooks.options[viewBooks.selectedIndex].value;
		fetch(`https://www.forverkliga.se/JavaScript/api/crud.php?op=delete&key=${masterKey}&id=${delId}`)
		.then(function(response){
			return response.json();
		})
		.then(function(delBook){
			if(delBook.status === "error"){
				showMessage(delBook.status, delBook.message, view);
				setTimeout(() => {
					view.removeChild(msgBox)
					addBtn.disabled = false;
					viewBtn.disabled = false;
					delBtn.disabled = false;
				}, 3000);
				//alert(`Something went wrong: ${delBook.message}`);
			}
			else{
				showMessage(delBook.status, "", view);
				setTimeout(() => {
					view.removeChild(msgBox)
					addBtn.disabled = false;
					viewBtn.disabled = false;
					delBtn.disabled = false;
				}, 3000);
				//alert("The selected book has been deleted");
			}
		});
	}
})

viewBooks.addEventListener("click", function(event){
	if(viewBooks.options[viewBooks.selectedIndex] === undefined) event.preventDefault();
	
	else{
		let editId = viewBooks.options[viewBooks.selectedIndex].value;
		let book = viewBooks.options[viewBooks.selectedIndex].text.split(" <> ");
		editBookTitle.placeholder = book[0];
		editBookAuthor.placeholder = book[1];
		editDiv.className = "show";
		editBookAuthor.addEventListener("blur", function(){
			fetch(`https://www.forverkliga.se/JavaScript/api/crud.php?op=update&key=${masterKey}&id=${editId}&title=${editBookTitle.value}&author=${editBookAuthor.value}`)
			.then(function (response){
				return response.json();
			})
			.then(function(editBook){
				if(editBook.status === "error"){
					showMessage(editBook.status, editBook.message, view);
					setTimeout(() => {
						view.removeChild(msgBox)
					}, 3000);
					//alert(`Something went wrong: ${editBook.message}`);
				}
				else{
					editDiv.className = "noShow";
					showMessage(editBook.status, "", view);
					setTimeout(() => {
						view.removeChild(msgBox)
					}, 3000);
					//alert("The selected book has been successfully edited");
					console.log(editBookAuthor.value + editBookTitle.value + "id: " + editId);
				}
			});
		});
	}
});

googleSrhBtn.addEventListener("click", function(event){
	if(googleSrh.value === "") event.preventDefault();
	else{
		viewGoogle.innerText = "";
		fetch(`https://www.googleapis.com/books/v1/volumes?q=${googleSrh.value}`)
		.then(function(response){
			return response.json();
		})
		.then(function(googleBooks){
			console.log(googleBooks);
			console.log("Title: " + googleBooks.items[0].volumeInfo.title);
			console.log("Author: " + googleBooks.items[0].volumeInfo.authors[0]);
			for(let i = 0; i < 5; i++){
				if(googleBooks.items[i].volumeInfo.authors === undefined){
					googleBooks.items[i].volumeInfo.authors = [];
					googleBooks.items[i].volumeInfo.authors[0] = "No data";
				}
				let gOption = document.createElement("option");
				gOption.innerText = googleBooks.items[i].volumeInfo.title + " <> " + googleBooks.items[i]. volumeInfo.authors[0];
				viewGoogle.appendChild(gOption);
			}
		})
	}
})

googleAddBtn.addEventListener("click", function(event){
	if(viewGoogle.options[viewGoogle.selectedIndex] === undefined) event.preventDefault();

	else{
		let addGoogle = viewGoogle.options[viewGoogle.selectedIndex].text.split(" <> ");
		fetch(`https://www.forverkliga.se/JavaScript/api/crud.php?op=insert&key=${masterKey}&title=${addGoogle[0]}&author=${addGoogle[1]}`)
		.then(function(response){
			console.log("Titel: " + addGoogle[0] + " Author: " + addGoogle[1]);
			return response.json();
		})
		.then(function(gBook){
			if(gBook.status === "error"){
				showMessage(gBook.status, gBook.message, google);
				setTimeout(() => {
					google.removeChild(msgBox)
				}, 3000);
				//alert(`Something went wrong: ${gBook.message}`);
			}
			else{
				showMessage(gBook.status, "", google);
				setTimeout(() => {
					google.removeChild(msgBox)
				}, 3000);
				//alert("The book from Google has been added");
			}
		});
	}
});
