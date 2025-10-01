const names = ["Spongebob", "Patrick", "Squidward", "Sandy"];
const jsonString = JSON.stringify(names);
const parsedData = JSON.parse(jsonString);
fetch("people.json")
    .then(response => response.json())
    .then(values => values.array.forEach(value => console.log(value.name)))
    .catch(error => console.error(error));
//
fetch("https://samwichcp.github.io/names.json")
    .then(response => response.json())
    .then(value => dataP.innerHTML = value)
    .catch(error => console.error(error));

//console.log(navigator.cookieEnabled);
document.cookie = "firstName=HelloThere; expires=Sun, 5 October 2000 12:00:00 UTC; path=/";
document.cookie = "lastName=SquarePants; expires=Sun, 5 October 2025 12:00:00 UTC; path=/";

setCookie("email", "HelloThere@gmail.com", 265);
//console.log(document.cookie);
function setCookie(_name, _value, _daysToLive)
{
    const date = new Date();
    date.setTime(date.getTime() + _daysToLive * 24 * 60 * 60 * 1000);
    let expires = "expires=" + date.toUTCString();
    document.cookie = `${_name}=${_value}; ${expires}; path=/`;
}
function getCookie(_name)
{
    const cDecoded = decodeURIComponent(document.cookie);
    const cArray = cDecoded.split("; ");
    let result = null;

    cArray.forEach(element => 
    {
        if(element.indexOf(_name) == 0)
        {
            result = element.substring(_name.length + 1);

        }
    })
    return result;
}
function deleteCookie(_name)
{
    setCookie(_name, null, null);
}