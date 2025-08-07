import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface Props {
  open: boolean;
  imageUrl: string;
  onClose: () => void;
}

export default function ImageLightbox({ open, imageUrl, onClose }: Props) {
    // if (!imageUrl) return null;
  return (
    <Lightbox
      open={open}
      close={onClose}
      slides={[{ src: imageUrl }]}
    />
  );
}
