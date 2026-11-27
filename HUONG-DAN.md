# Thêm mèo SEO vào portfolio GitHub Pages

Bản này đã gắn mèo xám đeo khăn xanh vào trang hiện tại. Chú mèo đi dọc mép dưới trên desktop, đứng yên trên mobile, bấm để đổi lời thoại và có nút × để ẩn.

## Đưa lên GitHub

1. Mở repository `anhnamseo/anhnamseo.github.io`.
2. Cập nhật ba tệp ở thư mục gốc: `index.html`, `style.css`, `main.js`.
3. Thêm `assets/meo-seo-1.svg` và `assets/meo-seo-2.svg` vào thư mục `assets` hiện có. Giữ các ảnh chân dung và CV khác trong thư mục này.
4. Commit thay đổi, chờ GitHub Pages cập nhật rồi tải lại trang bằng Ctrl+F5.

## Nếu tự chèn vào bản HTML/CSS/JS khác

- HTML: chèn khối `<aside id="seo-mascot">` ở cuối `index.html`, ngay trước `</body>`.
- CSS: chép phần bắt đầu bằng `/* Mèo SEO:` ở cuối `style.css`.
- JavaScript: chép phần bắt đầu bằng `// Mascot:` vào trong hàm bao `(() => { ... })();` của `main.js`, trước dòng `})();`. Đoạn này sử dụng biến `reduceMotion` có sẵn trong `main.js` của portfolio.
- Hai ảnh SVG phải nằm tại `assets/meo-seo-1.svg` và `assets/meo-seo-2.svg` đúng với đường dẫn trong HTML/JS.

## Đổi sang mèo khác

Chuẩn bị hai ảnh của cùng một mèo, cùng kích thước khung và nền trong suốt, ví dụ `assets/meo-cua-toi-1.png` và `assets/meo-cua-toi-2.png` (hai dáng chân để tạo cảm giác đi bộ). Đổi `src` trong `index.html` và mảng `catFrames` trong `main.js`:

```js
const catFrames = ['assets/meo-cua-toi-1.png', 'assets/meo-cua-toi-2.png'];
```

Nếu chỉ có một ảnh, dùng cùng đường dẫn ở cả hai vị trí trong `catFrames`; mèo vẫn di chuyển nhưng không đổi dáng chân. Không sử dụng ảnh từ trang tham khảo nếu chưa có quyền sử dụng.
