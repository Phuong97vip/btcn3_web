// src\Js\addMovie.js

$(document).ready(function () {
    // Xử lý sự kiện gửi biểu mẫu
    $('#addMovieForm').on('submit', async function (e) {
      e.preventDefault(); // Ngăn chặn hành vi gửi biểu mẫu mặc định
  
      // Thu thập dữ liệu từ biểu mẫu
      const formData = {
        title: $('#movieTitle').val(),
        originalTitle: $('#originalTitle').val(),
        fullTitle: $('#fullTitle').val(),
        year: $('#year').val(),
        image: $('#image').val(),
        releaseDate: $('#releaseDate').val(),
        runtimeStr: $('#runtimeStr').val(),
        plot: $('#plot').val(),
        awards: $('#awards').val(),
        companies: $('#companies').val(),
        countries: $('#countries').val(),
        languages: $('#languages').val(),
        imDbRating: $('#imDbRating').val(),
        boxOffice: $('#boxOffice').val()
      };
  
      try {
        // Gửi yêu cầu POST đến backend để thêm phim mới
        const response = await fetch('/api/movies/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
  
        const result = await response.json();
  
        if (response.ok) {
          // Hiển thị thông báo thành công
          alert('Thêm phim thành công!');
          // Đóng trang hoặc chuyển hướng về trang chủ
          window.location.href = '/';
        } else {
          // Hiển thị thông báo lỗi
          alert(`Lỗi: ${result.message}`);
        }
      } catch (error) {
        console.error('Error adding movie:', error);
        alert('Đã xảy ra lỗi khi thêm phim. Vui lòng thử lại sau.');
      }
    });
  });
  