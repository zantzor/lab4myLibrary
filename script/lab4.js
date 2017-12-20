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
let addInfo = document.getElementById("addInfo");
let booksInfo = document.getElementById("booksInfo");
let googleInfo = document.getElementById("googleInfo");


function showMessage(status, message, section){
	if(status === "error"){
		errorCounter++;
		errorPara.innerText = message;
		showErrCnt.innerText = errorCounter;
	}
	else{
		console.log(section);
		switch(section){
			case "add":
				addInfo.innerText = "Success";
				break;
			case "google":
				googleInfo.innerText = "Success";
				break;
			case "view":
				booksInfo.innerText = "Success";
				break;
		}
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
		key.value = keyNr.key;
	})
})


function addFetch(event, addTitle, addAuthor, origin){
	fetch(`https://www.forverkliga.se/JavaScript/api/crud.php?op=insert&key=${masterKey}&title=${addTitle}&author=${addAuthor}`)
	.then(function(response){
		return response.json();
	})
	.then(function(addB){
		console.log(addB);
		if(addB.status === "error"){
			showMessage(addB.status, addB.message, origin);
			addFetch(event, addTitle, addAuthor, origin);
		}
		else{
			showMessage(addB.status, "", origin);
			event.target.className = "enabled";
			event.target.disabled = false;
		}
	})
}

addBtn.addEventListener("click", function(event){
	event.target.className = "disabled";
	event.target.disabled = true;
	addInfo.innerText = "";
	addFetch(event, addBookTitle.value, addBookAuthor.value, "add");
})

function bookFetch(event){
	booksInfo.innerText = "";
	fetch(`https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key=${masterKey}`)
	.then(function (response){
		return response.json();
	})
	.then(function(viewB){
		if(viewB.status === "error"){
			showMessage(viewB.status, viewB.message, "view");
			bookFetch(event);
		}
		else{
			viewBooks.innerHTML = "";
			viewB.data.forEach(function(book){
				let newOption = document.createElement("option");
				newOption.value = book.id;
				newOption.innerText = book.title + " <> " + book.author;
				viewBooks.appendChild(newOption);
				event.target.className = "enabled";
				event.target.disabled = false;
				console.log(book);
				console.log(view.data);
				console.log("Book title: " + book.title);
			})
		}
	});
}

viewBtn.addEventListener("click", function(event){
	event.target.className = "disabled";
	event.target.disabled = true;
	bookFetch(event);
	
});


function delFetch(event, id){
	fetch(`https://www.forverkliga.se/JavaScript/api/crud.php?op=delete&key=${masterKey}&id=${id}`)
		.then(function(response){
			return response.json();
		})
		.then(function(delBook){
			if(delBook.status === "error"){
				showMessage(event, delBook.status, delBook.message, "view");
				delFetch(event, id);
			}
			else{
				showMessage(delBook.status, "", "view");
				event.target.className = "enabled";
				event.target.disabled = false;
			}
		});
}

delBtn.addEventListener("click", function(event){
	booksInfo.innerText = "";
	if(viewBooks.options[viewBooks.selectedIndex] === undefined) event.preventDefault();
	else{
		event.target.className = "disabled";
		event.target.disabled = true;
		let delId = viewBooks.options[viewBooks.selectedIndex].value;
		delFetch(event, delId);
	}
})

viewBooks.addEventListener("click", function(event){
	booksInfo.innerText = "";
	if(viewBooks.options[viewBooks.selectedIndex] === undefined) event.preventDefault();
	else{
		let editId = viewBooks.options[viewBooks.selectedIndex].value;
		let book = viewBooks.options[viewBooks.selectedIndex].text.split(" <> ");
		editBookTitle.placeholder = book[0];
		editBookAuthor.placeholder = book[1];
		editDiv.className = "show";
		editBookAuthor.addEventListener("blur", function(){
			editFetch(editBookTitle.value, editBookAuthor.value, editId);		
		});
	}
});

function editFetch(editTitle, editAuthor, id){
	fetch(`https://www.forverkliga.se/JavaScript/api/crud.php?op=update&key=${masterKey}&id=${id}&title=${editTitle}&author=${editAuthor}`)
			.then(function (response){
				return response.json();
			})
			.then(function(editBook){
				if(editBook.status === "error"){
					showMessage(editBook.status, editBook.message, "view");
					editFetch(editTitle, editAuthor);
				}
				else{
					editDiv.className = "noShow";
					showMessage(editBook.status, "", "view");
				}
			});
}

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
	googleInfo.innerText = "";
	event.target.className = "disabled";
	event.target.disabled = true;
	if(viewGoogle.options[viewGoogle.selectedIndex] === undefined) event.preventDefault();
	else{
		let addGoogle = viewGoogle.options[viewGoogle.selectedIndex].text.split(" <> ");
		addFetch(event, addGoogle[0], addGoogle[1], "google");
	}
});
