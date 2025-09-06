<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio Game — Abdullah</title>
  <style>
    /* --- Reset basic styles --- */
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }

    body {
      background: linear-gradient(to bottom, #0a0a0a, #111);
      color: #fff;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 20px;
      overflow-x: hidden;
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
      color: #00ffcc;
      animation: fadeInDown 1s ease forwards;
    }

    p {
      color: #ccc;
      margin-bottom: 20px;
      max-width: 800px;
      text-align: center;
      animation: fadeIn 1.5s ease forwards;
    }

    /* --- Project sections --- */
    .feature {
      background: rgba(0, 255, 204, 0.1);
      border: 1px solid #00ffcc;
      border-radius: 15px;
      padding: 20px;
      margin: 15px;
      width: 90%;
      max-width: 800px;
      animation: slideInUp 1s ease forwards;
    }

    .feature h2 {
      color: #00ffcc;
      margin-bottom: 10px;
    }

    /* --- Buttons --- */
    a.button {
      display: inline-block;
      margin: 10px;
      padding: 10px 20px;
      background: #00ffcc;
      color: #000;
      text-decoration: none;
      font-weight: bold;
      border-radius: 10px;
      transition: 0.3s;
    }

    a.button:hover {
      background: #00cc99;
      transform: scale(1.05);
    }

    /* --- Animations --- */
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-50px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(50px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* --- Parallax background --- */
    body::before {
      content: "";
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: url('assets/backgrounds/layer1-stars.png') repeat;
      background-size: cover;
      z-index: -3;
      animation: moveStars 200s linear infinite;
    }

    @keyframes moveStars {
      from { background-position: 0 0; }
      to { background-position: -10000px 0; }
    }
  </style>
</head>
<body>
  <h1>Portfolio Game — Abdullah</h1>
  <p>هذه اللعبة التفاعلية تمثل بورتفوليو عبدالله بالكامل. تحكم باللاعب وتعرف على المشاريع مع خلفيات متحركة وألوان جذابة.</p>

  <div class="feature">
    <h2>🎮 التحكم باللعبة</h2>
    <p>على الكمبيوتر: الأسهم ← → للتحرك، سهم ↑ للقفز أو W/A/D</p>
    <p>على الموبايل: عصا التحكم الظاهرية + زر القفز</p>
  </div>

  <div class="feature">
    <h2>🌌 الميزات</h2>
    <ul>
      <li>حركة اللاعب بسلاسة مع القفز</li>
      <li>خلفيات Parallax لإحساس بالعمق</li>
      <li>Responsive لجميع الشاشات</li>
      <li>أنيميشنات: المشي، الوقوف، القفز</li>
      <li>منصات تفاعلية تعرض مشاريع البورتفوليو</li>
    </ul>
  </div>

  <div class="feature">
    <h2>🛠️ التثبيت</h2>
    <p>
      <code>git clone &lt;REPO_URL&gt;</code><br>
      <code>cd portfolio-game</code><br>
      <code>npm install</code><br>
      <code>npm run dev</code>
    </p>
    <a href="https://github.com/USERNAME/portfolio-game" class="button" target="_blank">GitHub Repo</a>
  </div>

  <script>
    // Simple animation for scroll fade-in
    const features = document.querySelectorAll('.feature');
    window.addEventListener('scroll', () => {
      features.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if(top < window.innerHeight - 50){
          el.style.opacity = 1;
          el.style.transform = "translateY(0)";
        }
      });
    });
  </script>
</body>
</html>
