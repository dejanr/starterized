http_path = "./"
css_dir = "css"
sass_dir = "compass"
images_dir = "images"
javascripts_dir = "js"
sprite_load_path = images_dir + "/sprites/source"
generated_images_dir = images_dir + "/sprites/generated"

# Making sure sprites work with generated paths:
relative_assets = true

# Don't append query strings ('?2011051020102') to assets:
asset_cache_buster :none

# FireSASS activation (uncomment line below if you need FireSASS):
# sass_options = {:debug_info => true}

# Output style
output_style = :compressed
