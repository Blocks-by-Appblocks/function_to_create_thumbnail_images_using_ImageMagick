

const function_to_create_thumbnail_images_using_ImageMagick = async (req, res) => {

  // health check
  if (req.params["health"] === "health") {
    res.write(JSON.stringify({success: true, msg: "Health check success"}))
    res.end()
  }

  // Add your code here
  res.write(JSON.stringify({success: true, msg: `Hello function_to_create_thumbnail_images_using_ImageMagick`}))
  res.end()
  
}

export default function_to_create_thumbnail_images_using_ImageMagick
