import { CircularProgress } from "@heroui/react";

export default function CircularProgressBar() {
  return (
    <CircularProgress
      color="success"
      showValueLabel={true}
      size="lg"
      value={70}
    />
  );
}
