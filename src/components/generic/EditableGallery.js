import React, { useState } from "react";
import { IconButton, ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import PropTypes from "prop-types";
import { Delete } from "@mui/icons-material";

const EditableGallery = ({ links, changeLinks }) => {
  const [images, setImages] = useState(links)
  const deleteImage = (link) => {
    const filtered = [...images.filter((l) => l !== link)]
    changeLinks(filtered)
    setImages(filtered)
  }
  return (
    <ImageList>
      {images.map((link, index) => (
        <ImageListItem key={link}>
          <img src={`${link}?=w=164&h=164&fit=crop&auto=format`} alt={index} loading="lazy" />
          <ImageListItemBar
            actionIcon={
              <IconButton onClick={() => deleteImage(link)}>
                <Delete />
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  )
}
EditableGallery.propTypes = {
  links: PropTypes.array,
  changeLinks: PropTypes.func,
}
export default EditableGallery
