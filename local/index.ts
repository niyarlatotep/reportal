const testDate = new Date('2019-05-04T07:02:11.561Z');
console.log(
    testDate.toLocaleDateString('en-GB'
        // , {month: "2-digit", day: "2-digit", year: "2-digit"}
        )
        // .replace(/\//g, '.')
    ,testDate.toLocaleTimeString()
);
try {
        throw new Error();
}catch (e) {
        console.error(e.stack);
}