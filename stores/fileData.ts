import create from "zustand";

type FileDataState = {
  image?: File;
  setImage: (image: File) => void;
};

export default create<FileDataState>((set: any) => ({
  image: null,
  setImage: (image) => set({ image }),
}));
