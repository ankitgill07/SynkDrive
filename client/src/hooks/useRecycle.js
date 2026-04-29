import {
  getAllRecycleBinData,
  getRecycleDataByIdApi,
} from "@/api/RecycleBinApi";
import { setChildFolderData, setRecycleData } from "@/lib/RecycleSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

function useRecycle() {
  const [openRecycleFolder, setOpenRecycleFolder] = useState(false);
  const [seletectId, setSeletectId] = useState("");
  const dispatch = useDispatch();

  const fetchRicycleData = async () => {
    const { rootFolder, rootFile } = await getAllRecycleBinData();
    dispatch(setRecycleData([...rootFolder, ...rootFile]));
  };

  const fetchRicycleDataById = async (id) => {
    setSeletectId(id);
    setOpenRecycleFolder(true);
    const { files, folders } = await getRecycleDataByIdApi(id);
    dispatch(setChildFolderData([...files, ...folders]));
  };

  

  useEffect(() => {
    fetchRicycleData();
  }, []);

  const handleOpen = (folder) => {};

  return {
    seletectId,
    fetchRicycleData,
    fetchRicycleDataById,
    openRecycleFolder,
    setOpenRecycleFolder,
  };
}

export default useRecycle;
