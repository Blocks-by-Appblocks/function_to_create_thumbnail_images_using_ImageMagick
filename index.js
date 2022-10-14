import Media from './media.js'

const function_to_create_thumbnail_images_using_ImageMagick = async (req, res) => {

  // health check
  if (req.params["health"] === "health") {
    res.write(JSON.stringify({success: true, msg: "Health check success"}))
    res.end()
  }
  try {
    if(req.query.src) {
      const image = new Media(req.query.src);
      const imageBuffer = await image.imageUrlToBuffer()
      const imageLocation = await image.thumb(req, imageBuffer);

      res.write(JSON.stringify({success: true, msg:'generated thumbnail', location: imageLocation}))
      res.end()
    } else {
      res.status(403).send({ success: false, msg: 'Forbidden' })
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message })
  }
  
  
}

export default function_to_create_thumbnail_images_using_ImageMagick
