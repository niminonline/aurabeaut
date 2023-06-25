// =============Preview upload images======================

function previewImages(event) {
    var input = event.target;
    if (input.files.length > 3) {
      new swal("You can select only up to 3 files");
      // alert("You can only select up to 3 files.");
      event.target.value = "";
    }
    var imagePreviews = document.getElementById("image-previews");
    imagePreviews.innerHTML = "";

    if (input.files && input.files.length > 0) {
      for (var i = 0; i < input.files.length; i++) {
        var reader = new FileReader();
        reader.onload = (function (file) {
          return function (e) {
            var imagePreview = document.createElement("img");
            imagePreview.src = e.target.result;
            imagePreview.alt = "Selected Image";
            imagePreview.style.display = "inline-block";
            imagePreview.style.maxWidth = "100px"; // Adjust the width as needed
            imagePreview.style.height = "auto";
            imagePreview.style.margin = "10px";
            imagePreviews.appendChild(imagePreview);
          };
        })(input.files[i]);

        reader.readAsDataURL(input.files[i]);
      }
    }
  }