setImmediate(async () => {
    const text = `<div class="gdoc-paragraph">Chi phí dành cho việc kiểm thử là lớn nhất ở giai đoạn nào?\\n`
    const find = /">(.*)\\n/gm.exec(text)[1]
    console.log({find})
})