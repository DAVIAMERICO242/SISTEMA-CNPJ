function getCurrentDateTimeString() {
    const currentDate = new Date();

    // Get day, month, year, hour, and minute components
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = currentDate.getFullYear();
    const hour = currentDate.getHours().toString().padStart(2, '0');
    const minute = currentDate.getMinutes().toString().padStart(2, '0');

    // Format the date string as day_month_year_hour_minute
    return `${day}_${month}_${year}_${hour}h${minute}m`;
}

module.exports={getCurrentDateTimeString}
