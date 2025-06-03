import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const RecommendedButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      background={"white"}
      color={"black"}
      variant="outline"
      size="sm"
      onClick={() => navigate("/Recommended")}
    >
      Recommended
    </Button>
  );
};