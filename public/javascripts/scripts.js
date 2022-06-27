const  searchBar = () => {
  const searchButton = document.getElementById("search");
  const bookSearch = document.getElementById("bookSearch");

  searchButton.addEventListener((e) => {
   
    console.log(bookSearch.value);
    console.log("Hi");
  });

} 