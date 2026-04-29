import { useParams } from "react-router-dom";
import { FileProgressProvider } from "../contextApi/FileProgress";
import DriveHome from "./DriveHome";

function FolderWrapper() {
  const { id } = useParams();

  return (
    <FileProgressProvider folderId={id}>
      <DriveHome />
    </FileProgressProvider>
  );
}

export default FolderWrapper;
