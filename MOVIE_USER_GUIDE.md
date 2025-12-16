# 🎬 Hướng dẫn sử dụng Movie Listing

## 📖 Giới thiệu

Movie Listing là tính năng quản lý và duyệt danh sách phim với các công cụ tìm kiếm, lọc, sắp xếp và phân trang mạnh mẽ. Bạn có thể dễ dàng tìm kiếm bộ phim yêu thích trong bộ sưu tập với hơn 20 bộ phim kinh điển.

---

## 🚀 Truy cập tính năng

### Cách 1: Từ Navigation Menu
1. Mở ứng dụng tại `http://localhost:4200`
2. Click vào **🎬 Movies** trên thanh navigation phía trên
3. Bạn sẽ được chuyển đến trang Movie Listing

### Cách 2: Truy cập trực tiếp
- Mở trình duyệt và truy cập: `http://localhost:4200/movies`

---

## 📊 Giao diện tổng quan

Khi vào trang Movie Listing, bạn sẽ thấy:

### 1. **Header & Statistics** (Phía trên cùng)
Hiển thị thống kê tổng quan:
- **Total Movies**: Tổng số phim trong bộ sưu tập
- **Filtered**: Số phim sau khi áp dụng bộ lọc
- **Showing**: Số phim đang hiển thị trên trang hiện tại

### 2. **Search Bar** (Thanh tìm kiếm)
- Ô tìm kiếm lớn với icon 🔍
- Nút **Hide/Show Filters**: Ẩn/hiện bảng điều khiển bộ lọc
- Nút **Reset All**: Xóa tất cả bộ lọc và tìm kiếm

### 3. **Filters Panel** (Bảng điều khiển bộ lọc)
Các tùy chọn lọc và sắp xếp chi tiết

### 4. **Movie Grid** (Lưới hiển thị phim)
Danh sách các thẻ phim với thông tin đầy đủ

### 5. **Pagination** (Phân trang)
Điều khiển chuyển trang ở cuối danh sách

---

## 🔍 Tìm kiếm phim

### Tìm kiếm cơ bản

1. **Nhập từ khóa** vào ô tìm kiếm
   - Tìm theo **tên phim**: Ví dụ "Matrix", "Godfather"
   - Tìm theo **đạo diễn**: Ví dụ "Nolan", "Tarantino"

2. **Kết quả tự động cập nhật** ngay khi bạn gõ

3. **Xóa tìm kiếm**:
   - Click nút **✕** bên phải ô tìm kiếm
   - Hoặc click **Reset All**

### Ví dụ tìm kiếm:

```
Tìm "Matrix" → Hiển thị "The Matrix"
Tìm "Nolan" → Hiển thị tất cả phim của Christopher Nolan
Tìm "2019" → Không tìm trong năm (dùng bộ lọc Year Range)
```

**💡 Mẹo**: Tìm kiếm không phân biệt chữ hoa/thường

---

## 🎯 Lọc phim

Click **Show Filters** để mở bảng điều khiển bộ lọc với 5 tùy chọn:

### 1. **Genre (Thể loại)** 🎭

**Cách sử dụng:**
- Click vào dropdown **Genre**
- Chọn thể loại muốn xem:
  - **All Genres**: Hiển thị tất cả
  - **Action**: Phim hành động
  - **Crime**: Phim tội phạm
  - **Drama**: Phim chính kịch
  - **Sci-Fi**: Phim khoa học viễn tưởng
  - **Thriller**: Phim ly kỳ
  - **War**: Phim chiến tranh
  - **Animation**: Phim hoạt hình

**Ví dụ:**
```
Chọn "Action" → Hiển thị: The Dark Knight, Gladiator, Avengers: Endgame
Chọn "Sci-Fi" → Hiển thị: Inception, The Matrix, Interstellar
```

### 2. **Min Rating (Đánh giá tối thiểu)** ⭐

**Cách sử dụng:**
- Kéo thanh trượt từ **0** đến **10**
- Giá trị hiện tại hiển thị bên cạnh nhãn
- Chỉ hiển thị phim có rating ≥ giá trị đã chọn

**Ví dụ:**
```
Min Rating = 0   → Hiển thị tất cả phim
Min Rating = 8.5 → Chỉ phim có rating từ 8.5 trở lên
Min Rating = 9.0 → Chỉ phim xuất sắc nhất
```

**💡 Mẹo**: 
- Rating 9.0+ = Phim kinh điển
- Rating 8.5+ = Phim rất hay
- Rating 8.0+ = Phim hay

### 3. **Year Range (Khoảng năm)** 📅

**Cách sử dụng:**
- Nhập năm **From** (từ năm)
- Nhập năm **To** (đến năm)
- Chỉ hiển thị phim trong khoảng năm này

**Ví dụ:**
```
From: 1990, To: 2000 → Phim thập niên 90
From: 2010, To: 2020 → Phim thập niên 2010
From: 1972, To: 1972 → Chỉ phim năm 1972 (The Godfather)
```

**💡 Mẹo**: Để tìm phim theo thập kỷ:
- 1990-1999: Thập niên 90
- 2000-2009: Thập niên 2000
- 2010-2019: Thập niên 2010

### 4. **Sort By (Sắp xếp)** 📊

**Các tùy chọn sắp xếp:**

| Tùy chọn | Mô tả | Khi nào dùng |
|----------|-------|--------------|
| **Title** | Sắp xếp theo tên phim (A-Z) | Tìm phim theo alphabet |
| **Year** | Sắp xếp theo năm phát hành | Xem phim mới nhất/cũ nhất |
| **Rating** | Sắp xếp theo điểm đánh giá | Tìm phim hay nhất |
| **Duration** | Sắp xếp theo độ dài phim | Tìm phim ngắn/dài |

**Hướng sắp xếp:**
- Click nút **⬆️** (Ascending - Tăng dần): A→Z, 1→10, ngắn→dài
- Click nút **⬇️** (Descending - Giảm dần): Z→A, 10→1, dài→ngắn

**Ví dụ:**
```
Sort by "Rating" ⬇️ → Phim hay nhất lên đầu
Sort by "Year" ⬇️ → Phim mới nhất lên đầu
Sort by "Title" ⬆️ → Sắp xếp A-Z
Sort by "Duration" ⬆️ → Phim ngắn nhất lên đầu
```

### 5. **Items per page (Số phim mỗi trang)** 📏

**Các tùy chọn:**
- **6 phim/trang**: Xem chi tiết, ít cuộn
- **12 phim/trang**: Cân bằng (mặc định)
- **24 phim/trang**: Xem nhiều phim cùng lúc
- **48 phim/trang**: Xem toàn bộ (nếu ít hơn 48 phim)

**💡 Mẹo**: 
- Màn hình nhỏ: Chọn 6 hoặc 12
- Màn hình lớn: Chọn 24 hoặc 48

---

## 🎬 Đọc thông tin phim

Mỗi thẻ phim (Movie Card) hiển thị:

### Phần Poster (Ảnh phim)
- **Ảnh poster** phim chất lượng cao
- **Rating badge** (huy hiệu điểm): ⭐ + số điểm (0-10)
- Hover vào ảnh sẽ phóng to nhẹ

### Phần Content (Nội dung)

1. **Tiêu đề phim** (to, đậm)
   - Ví dụ: "The Shawshank Redemption"

2. **Metadata** (Thông tin meta)
   - 🎭 **Genre**: Thể loại phim
   - 📅 **Year**: Năm phát hành
   - ⏱️ **Duration**: Thời lượng (giờ + phút)

3. **Đạo diễn** (màu tím)
   - 🎬 + Tên đạo diễn
   - Ví dụ: "🎬 Christopher Nolan"

4. **Mô tả phim** (3 dòng)
   - Tóm tắt nội dung phim
   - Tự động cắt nếu quá dài

5. **Star Rating** (Đánh giá sao)
   - 5 ngôi sao: ★★★★★ hoặc ☆☆☆☆☆
   - Số sao tô màu = Rating/2
   - Ví dụ: Rating 9.0 = 4.5 sao ≈ ★★★★★

---

## 📄 Phân trang

Ở cuối danh sách phim, bạn sẽ thấy:

### Thông tin hiển thị
```
Showing 1 to 12 of 20 movies
```
- **1 to 12**: Phim thứ 1 đến 12 đang hiển thị
- **of 20**: Tổng 20 phim (sau khi lọc)

### Điều khiển phân trang

1. **← Previous**: Về trang trước
   - Disabled (mờ) nếu đang ở trang 1

2. **Số trang**: 1, 2, 3, 4, ...
   - Trang hiện tại có màu trắng
   - Click số để nhảy đến trang đó
   - Hiển thị tối đa 7 số trang

3. **Next →**: Sang trang tiếp
   - Disabled nếu đang ở trang cuối

4. **Tổng kết**:
   ```
   Page 1 of 2
   ```

**💡 Mẹo**: Khi chuyển trang, trang tự động cuộn lên đầu

---

## 🎯 Các tình huống sử dụng

### Tình huống 1: Tìm phim của Christopher Nolan

**Bước 1**: Nhập "Nolan" vào ô tìm kiếm

**Kết quả**: 
- The Dark Knight
- Inception
- Interstellar
- The Prestige

**Bước 2** (Tùy chọn): Sắp xếp theo Rating ⬇️ để xem phim hay nhất

---

### Tình huống 2: Xem phim hành động hay nhất

**Bước 1**: Click **Show Filters**

**Bước 2**: 
- Chọn Genre = **Action**
- Kéo Min Rating = **8.5**

**Bước 3**: Sort by **Rating** ⬇️

**Kết quả**: Danh sách phim hành động có rating ≥ 8.5, sắp xếp từ cao xuống thấp

---

### Tình huống 3: Xem phim thập niên 90

**Bước 1**: Click **Show Filters**

**Bước 2**: 
- Year From = **1990**
- Year To = **1999**

**Bước 3**: Sort by **Year** ⬇️ (mới nhất trước)

**Kết quả**: Tất cả phim từ 1990-1999

---

### Tình huống 4: Tìm phim ngắn để xem nhanh

**Bước 1**: Click **Show Filters**

**Bước 2**: Sort by **Duration** ⬆️ (ngắn nhất trước)

**Kết quả**: Phim ngắn nhất lên đầu (The Lion King - 88 phút)

---

### Tình huống 5: Xem tất cả phim Sci-Fi xuất sắc

**Bước 1**: Click **Show Filters**

**Bước 2**:
- Genre = **Sci-Fi**
- Min Rating = **8.5**

**Bước 3**: Sort by **Rating** ⬇️

**Kết quả**: 
- Inception (8.8)
- The Matrix (8.7)
- Interstellar (8.6)

---

## 🔄 Reset và làm mới

### Reset tất cả bộ lọc

Click nút **🔄 Reset All** để:
- Xóa search query
- Reset Genre về "All Genres"
- Reset Min Rating về 0
- Reset Year Range về 1900-2024
- Reset về trang 1

### Khi nào nên Reset?

- Khi không tìm thấy kết quả mong muốn
- Khi muốn bắt đầu tìm kiếm mới
- Khi bộ lọc quá phức tạp

---

## 📱 Responsive Design

Giao diện tự động điều chỉnh theo kích thước màn hình:

### Desktop (Màn hình lớn)
- Hiển thị 3-4 phim mỗi hàng
- Filters panel hiển thị dạng lưới
- Tất cả controls trên 1 hàng

### Tablet (Màn hình vừa)
- Hiển thị 2 phim mỗi hàng
- Filters panel thu gọn

### Mobile (Màn hình nhỏ)
- Hiển thị 1 phim mỗi hàng
- Filters panel xếp dọc
- Controls xếp dọc

---

## 🎨 Hiệu ứng và Animation

### Hover Effects (Di chuột)
- **Movie Card**: Nổi lên và có bóng đổ
- **Poster Image**: Phóng to nhẹ
- **Buttons**: Nổi lên khi hover

### Loading State
- Hiển thị spinner xoay tròn
- Text "Loading movies..."
- Xuất hiện khi đang tải dữ liệu

### Empty States

1. **No Movies Available**
   - Icon: 🎬
   - Message: "There are no movies in the collection yet."
   - Xuất hiện khi database trống

2. **No Results Found**
   - Icon: 🔍
   - Message: "Try adjusting your filters or search query."
   - Button: "Reset Filters"
   - Xuất hiện khi bộ lọc quá strict

---

## ⚡ Performance Tips

### Tối ưu trải nghiệm:

1. **Sử dụng bộ lọc thay vì scroll**
   - Nhanh hơn việc cuộn tìm phim

2. **Tăng Items per page nếu biết chính xác**
   - Giảm số lần chuyển trang

3. **Kết hợp Search + Filter**
   - Ví dụ: Search "Nolan" + Genre "Sci-Fi"

4. **Sử dụng Sort thông minh**
   - Rating ⬇️: Tìm phim hay
   - Year ⬇️: Tìm phim mới
   - Duration ⬆️: Tìm phim ngắn

---

## 🐛 Xử lý sự cố

### Không tìm thấy phim?

**Nguyên nhân có thể:**
1. Bộ lọc quá strict (Min Rating quá cao)
2. Year Range quá hẹp
3. Sai chính tả trong search

**Giải pháp:**
- Click **Reset All**
- Thử lại với bộ lọc rộng hơn

### Trang trống?

**Kiểm tra:**
1. Có thông báo "No Results Found" không?
2. Statistics có hiển thị "Filtered: 0" không?

**Giải pháp:**
- Reset filters
- Kiểm tra kết nối internet (nếu load từ API)

### Phân trang không hoạt động?

**Kiểm tra:**
1. Đang ở trang cuối? (Next disabled)
2. Đang ở trang đầu? (Previous disabled)

**Giải pháp:**
- Click số trang trực tiếp
- Refresh trang

---

## 📊 Thống kê bộ sưu tập

### Tổng quan dữ liệu hiện tại:

- **Tổng số phim**: 20 phim
- **Thể loại**: 8 thể loại (Action, Crime, Drama, Sci-Fi, Thriller, War, Animation)
- **Năm phát hành**: 1972 - 2019
- **Rating**: 8.4 - 9.3
- **Thời lượng**: 88 - 189 phút

### Top phim theo Rating:

1. The Shawshank Redemption - 9.3
2. The Godfather - 9.2
3. The Dark Knight - 9.0
4. Pulp Fiction - 8.9
5. Forrest Gump - 8.8

### Đạo diễn có nhiều phim nhất:

- **Christopher Nolan**: 4 phim (The Dark Knight, Inception, Interstellar, The Prestige)
- **Martin Scorsese**: 2 phim (Goodfellas, The Departed)
- **Frank Darabont**: 2 phim (The Shawshank Redemption, The Green Mile)

---

## 💡 Tips & Tricks

### 1. Tìm kiếm nhanh
```
Gõ vài ký tự đầu → Kết quả hiện ngay
Ví dụ: "mat" → The Matrix
```

### 2. Combo Filter mạnh
```
Genre: Sci-Fi
Min Rating: 8.5
Sort: Rating ⬇️
→ Top phim Sci-Fi hay nhất
```

### 3. Khám phá theo thập kỷ
```
1970-1979: Phim cổ điển
1990-1999: Phim thập niên 90
2010-2019: Phim hiện đại
```

### 4. Tìm phim theo mood
```
Muốn xem phim ngắn: Sort Duration ⬆️
Muốn xem phim hay: Sort Rating ⬇️
Muốn xem phim mới: Sort Year ⬇️
```

### 5. Keyboard Shortcuts (Tương lai)
```
Ctrl + F: Focus search box
Esc: Clear search
→: Next page
←: Previous page
```

---

## 🎓 Kết luận

Movie Listing là công cụ mạnh mẽ để:
- ✅ Tìm kiếm phim nhanh chóng
- ✅ Lọc theo nhiều tiêu chí
- ✅ Sắp xếp linh hoạt
- ✅ Duyệt danh sách dễ dàng
- ✅ Khám phá phim mới

**Hãy thử ngay!** 🎬

---

## 📞 Hỗ trợ

Nếu gặp vấn đề hoặc có câu hỏi:
1. Đọc lại phần "Xử lý sự cố"
2. Thử Reset All
3. Refresh trang (F5)
4. Liên hệ support team

---

**Chúc bạn có trải nghiệm tuyệt vời với Movie Listing! 🍿🎬**
