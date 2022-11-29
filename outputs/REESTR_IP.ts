class REESTR_IP {
  caption: string;
  gridSize: number;
  formWidth: number;
  formHeight: number;
  toolbarTop: boolean;
  setCaption(caption: string) {
    this.caption = caption;
  }
  setGridSize(size: number) {
    this.gridSize = size;
  }
  setToolbarPosition(status: boolean) {
    this.toolbarTop = status;
  }
  setFormSize(x: number, y: number) {
    this.formWidth = x;
    this.formHeight = y;
  }
}

const instance = new REESTR_IP();

instance.setCaption("Исполнительное производство");
instance.setGridSize(80);
instance.setToolbarPosition(false);
instance.setFormSize(270, 200);