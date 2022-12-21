export const applyFiltersToImage = async (imageSrc, filter) => {
    const myImage = new Image()
    myImage.src = imageSrc

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext('2d')
    return myImage.onload = () => {
        canvas.width = myImage.width
        canvas.height = myImage.height
        if (filter) {
            ctx.filter = filter
        }

        ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height)

        return canvas.toDataURL("image/png")
    }
}