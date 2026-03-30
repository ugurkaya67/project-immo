export function getPropertyImage(type?: string | null, imageUrl?: string | null) {
  if (imageUrl && imageUrl.trim() !== "") return imageUrl;

  switch (type) {
    case "MAISON":
      return "/images/default-house.jpg";
    case "APPARTEMENT":
      return "/images/default-apartment.jpg";
    case "TERRAIN":
      return "/images/default-land.jpg";
    default:
      return "/images/default-property.jpg";
  }
}