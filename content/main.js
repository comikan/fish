<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>fish - roblox extension</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-color: #00a8ff;
            --secondary-color: #0097e6;
            --dark-color: #1e272e;
            --light-color: #f5f6fa;
            --tile-size: 60px;
            --glow-intensity: 0.8;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        body {
            background-color: var(--dark-color);
            color: var(--light-color);
            overflow-x: hidden;
            min-height: 100vh;
            perspective: 1000px;
        }

        .tile-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-columns: repeat(auto-fill, var(--tile-size));
            grid-auto-rows: var(--tile-size);
            gap: 1px;
            z-index: -1;
            transform-style: preserve-3d;
        }

        .tile {
            background-color: rgba(30, 39, 46, 0.7);
            transition: all 0.3s ease-out;
            transform-style: preserve-3d;
            position: relative;
            border-radius: 2px;
            transform: translateZ(0);
        }

        .tile:hover {
            background-color: var(--primary-color);
            box-shadow: 0 0 15px var(--primary-color);
            transform: translateZ(20px);
            z-index: 1;
        }

        .content {
            position: relative;
            z-index: 10;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            padding: 2rem;
            backdrop-filter: blur(2px);
        }

        /* Rest of your CSS remains the same */
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            animation: fadeInDown 1s ease-out;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .logo h1 {
            font-size: 2.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, #00a8ff, #00d2d3);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-transform: lowercase;
            letter-spacing: -1px;
        }

        .logo i {
            font-size: 2.5rem;
            color: var(--primary-color);
        }

        nav ul {
            display: flex;
            gap: 2rem;
            list-style: none;
        }

        nav a {
            color: var(--light-color);
            text-decoration: none;
            font-weight: 300;
            font-size: 1.1rem;
            position: relative;
            transition: color 0.3s;
            text-transform: lowercase;
        }

        nav a:hover {
            color: var(--primary-color);
        }

        nav a::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 2px;
            background-color: var(--primary-color);
            transition: width 0.3s;
        }

        nav a:hover::after {
            width: 100%;
        }

        .hero {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding: 4rem 0;
            max-width: 800px;
            animation: fadeInUp 1s ease-out 0.3s both;
        }

        .hero h2 {
            font-size: 3.5rem;
            margin-bottom: 1.5rem;
            line-height: 1.2;
            text-transform: lowercase;
        }

        .hero h2 span {
            color: var(--primary-color);
        }

        .hero p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            line-height: 1.6;
            opacity: 0.9;
        }

        .cta-buttons {
            display: flex;
            gap: 1.5rem;
            margin-top: 2rem;
        }

        .btn {
            padding: 0.8rem 1.8rem;
            border-radius: 50px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            text-transform: lowercase;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .btn-primary {
            background-color: var(--primary-color);
            color: var(--dark-color);
            border: 2px solid var(--primary-color);
        }

        .btn-primary:hover {
            background-color: transparent;
            color: var(--primary-color);
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 168, 255, 0.3);
        }

        .btn-secondary {
            background-color: transparent;
            color: var(--primary-color);
            border: 2px solid var(--primary-color);
        }

        .btn-secondary:hover {
            background-color: var(--primary-color);
            color: var(--dark-color);
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 168, 255, 0.3);
        }

        .features {
            padding: 5rem 0;
            animation: fadeIn 1s ease-out 0.6s both;
        }

        .features h3 {
            font-size: 2rem;
            margin-bottom: 3rem;
            text-align: center;
            text-transform: lowercase;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }

        .feature-card {
            background-color: rgba(30, 39, 46, 0.7);
            border-radius: 10px;
            padding: 2rem;
            transition: all 0.3s;
            border: 1px solid rgba(0, 168, 255, 0.1);
        }

        .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0, 168, 255, 0.1);
            border-color: rgba(0, 168, 255, 0.3);
        }

        .feature-card i {
            font-size: 2.5rem;
            color: var(--primary-color);
            margin-bottom: 1.5rem;
        }

        .feature-card h4 {
            font-size: 1.3rem;
            margin-bottom: 1rem;
            text-transform: lowercase;
        }

        .feature-card p {
            opacity: 0.8;
            line-height: 1.6;
        }

        footer {
            text-align: center;
            padding: 2rem;
            margin-top: auto;
            opacity: 0.7;
            font-size: 0.9rem;
            animation: fadeIn 1s ease-out 0.9s both;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 768px) {
            .hero h2 {
                font-size: 2.5rem;
            }
            
            nav ul {
                gap: 1rem;
            }
            
            .cta-buttons {
                flex-direction: column;
                width: 100%;
            }
            
            .btn {
                width: 100%;
                justify-content: center;
            }
            
            :root {
                --tile-size: 40px;
            }
        }
    </style>
</head>
<body>
    <div class="tile-container" id="tileContainer"></div>
    
    <div class="content">
        <header>
            <div class="logo">
                <i class="fas fa-fish"></i>
                <h1>fish</h1>
            </div>
            <nav>
                <ul>
                    <li><a href="#"><i class="fas fa-home"></i> home</a></li>
                    <li><a href="#"><i class="fas fa-download"></i> download</a></li>
                    <li><a href="#"><i class="fas fa-cog"></i> features</a></li>
                    <li><a href="#"><i class="fas fa-question-circle"></i> about</a></li>
                </ul>
            </nav>
        </header>
        
        <section class="hero">
            <h2>enhance your <span>roblox</span> experience</h2>
            <p>fish is a lightweight browser extension that adds powerful features to roblox, giving you more control, better ui, and quality of life improvements.</p>
            <div class="cta-buttons">
                <button class="btn btn-primary">
                    <i class="fas fa-download"></i> get fish
                </button>
                <button class="btn btn-secondary">
                    <i class="fas fa-play"></i> see demo
                </button>
            </div>
        </section>
        
        <section class="features">
            <h3>why fish is goated</h3>
            <div class="features-grid">
                <div class="feature-card">
                    <i class="fas fa-bolt"></i>
                    <h4>lightning fast</h4>
                    <p>optimized for performance so it won't slow down your roblox experience. works seamlessly in the background.</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-paint-brush"></i>
                    <h4>beautiful ui</h4>
                    <p>clean, modern interface that enhances roblox without cluttering your screen. customizable to your preferences.</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-shield-alt"></i>
                    <h4>safe & secure</h4>
                    <p>open-source code with no shady data collection. we respect your privacy and follow roblox's terms of service.</p>
                </div>
            </div>
        </section>
        
        <footer>
            <p>fish is not affiliated with roblox corporation. all trademarks belong to their respective owners.</p>
        </footer>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Create tile grid
            const tileContainer = document.getElementById('tileContainer');
            const tileSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--tile-size'));
            const tileGap = 1;
            
            // Calculate number of tiles needed
            const calculateTiles = () => {
                const cols = Math.ceil(window.innerWidth / (tileSize + tileGap));
                const rows = Math.ceil(window.innerHeight / (tileSize + tileGap));
                return cols * rows;
            };
            
            // Create tiles
            const createTiles = () => {
                tileContainer.innerHTML = '';
                const tileCount = calculateTiles();
                
                for (let i = 0; i < tileCount; i++) {
                    const tile = document.createElement('div');
                    tile.className = 'tile';
                    tileContainer.appendChild(tile);
                }
            };
            
            // Initialize tiles
            createTiles();
            
            // Mouse movement effect
            document.addEventListener('mousemove', function(e) {
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                
                const tiles = document.querySelectorAll('.tile');
                tiles.forEach(tile => {
                    const rect = tile.getBoundingClientRect();
                    const tileX = rect.left + rect.width / 2;
                    const tileY = rect.top + rect.height / 2;
                    
                    const distance = Math.sqrt(Math.pow(mouseX - tileX, 2) + Math.pow(mouseY - tileY, 2));
                    const maxDistance = 300;
                    
                    if (distance < maxDistance) {
                        const proximity = 1 - (distance / maxDistance);
                        const glow = proximity * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--glow-intensity'));
                        
                        tile.style.boxShadow = `0 0 ${15 * proximity}px rgba(0, 168, 255, ${glow})`;
                        tile.style.transform = `translateZ(${20 * proximity}px)`;
                        tile.style.backgroundColor = `rgba(0, 168, 255, ${0.7 * proximity})`;
                    } else {
                        tile.style.boxShadow = 'none';
                        tile.style.transform = 'translateZ(0)';
                        tile.style.backgroundColor = 'rgba(30, 39, 46, 0.7)';
                    }
                });
            });
            
            // Resize handler
            window.addEventListener('resize', createTiles);
            
            // Add click animation to buttons
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = this.classList.contains('btn-primary') ? 
                            'translateY(-3px)' : 'translateY(-3px)';
                    }, 150);
                    
                    // For demo purposes
                    if (this.textContent.includes('demo')) {
                        alert('fish demo would show here! imagine cool features popping up.');
                    }
                });
            });
        });
    </script>
</body>
</html>
