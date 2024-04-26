function formatDate(dateString) {
    if(!dateString){
        return dateString;
    }
    if(!dateString.includes('-')){
        return dateString;
    }
    // Create a new Date object from the provided string
    const date = new Date(dateString);

    // Extract day, month, and year components
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();

    // Return the formatted date string in the desired format
    return `${day}/${month}/${year}`;
}

module.exports={
    formatDate
}