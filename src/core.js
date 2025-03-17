import * as XLSX from "xlsx";

const zoomImage = (e) => {
    const img = e.target;
    const body = document.body;

    // Lấy vị trí ban đầu của ảnh
    const rect = img.getBoundingClientRect();

    // Tạo một bản sao của ảnh
    const cloneImg = img.cloneNode(true);
    cloneImg.style.position = "fixed";
    cloneImg.style.left = `${rect.left}px`;
    cloneImg.style.top = `${rect.top}px`;
    cloneImg.style.width = `${rect.width}px`;
    cloneImg.style.height = `${rect.height}px`;
    cloneImg.style.zIndex = "1000";
    cloneImg.style.transition = "transform 1s ease-in-out, left 1s ease-in-out, top 1s ease-in-out";

    // Thêm clone vào body
    body.appendChild(cloneImg);

    // Lấy kích thước màn hình để tính toán vị trí trung tâm
    const centerX = window.innerWidth / 2 - rect.width / 2;
    const centerY = window.innerHeight / 2 - rect.height / 2;

    // Phóng to ảnh vào giữa màn hình
    setTimeout(() => {
        cloneImg.style.left = `${centerX - 8}px`;
        cloneImg.style.top = `${centerY}px`;
        cloneImg.style.transform = "scale(2)";
    }, 20);

    // Thu nhỏ ảnh về vị trí cũ sau 1.5 giây
    setTimeout(() => {
        cloneImg.style.left = `${rect.left}px`;
        cloneImg.style.top = `${rect.top}px`;
        cloneImg.style.transform = "scale(1)";
    }, 4000);

    // Xóa ảnh sau animation
    setTimeout(() => {
        body.removeChild(cloneImg);
    }, 5000);
};


const readExcelFile = async (level) => {
  try {
    const filePath = `/data/hsk${level}.xlsx`;
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    return jsonData.map(row => ({
      hanzi: row.hanzi,
      pinyin: row.pinyin,
      mean: row.mean,
    }));
  } catch (error) {
    console.error("Lỗi đọc file Excel:", error);
    return [];
  }
};

const removeVietnameseAccents = (str) => {
  return str
    .normalize("NFD") // Tách dấu khỏi ký tự gốc
    .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
    .toLowerCase() // Chuyển về chữ thường
    .trim(); // Xóa khoảng trắng thừa
};



export { zoomImage, readExcelFile, removeVietnameseAccents };
