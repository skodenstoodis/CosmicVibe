// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a function to generate random stars
function generateStars() {
  const starGeometry = new THREE.SphereGeometry(0.5, 24, 24);
  const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  for (let i = 0; i < 1000; i++) {
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.position.set(
      Math.random() * 2000 - 1000,
      Math.random() * 2000 - 1000,
      Math.random() * 2000 - 1000
    );
    scene.add(star);
  }

}

// Set up the button to generate a new outer space background
const generateButton = document.getElementById('generateButton');

generateButton.addEventListener('click', () => {
  // Remove existing stars
  scene.children = scene.children.filter(child => !(child instanceof THREE.Mesh));

  // Generate new stars
  generateStars();

  // Create button geometry
  const buttonGeometry = new THREE.BoxGeometry(200, 50, 10);

  // Create button material
  const buttonMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    opacity: 0.5,
    transparent: true,
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.1
  });

  // Create button mesh
  const button = new THREE.Mesh(buttonGeometry, buttonMaterial);

  // Position button in the scene
  button.position.set(0, 0, -100);

  // Add button to the scene
  scene.add(button);
});

function animate() {
    requestAnimationFrame(animate);
  
    // Update star positions
    scene.children.forEach(child => {
      if (child instanceof THREE.Mesh) {
        child.position.x += (Math.random() - 0.5) * 1;
        child.position.y += (Math.random() - 0.5) * 1;
        child.position.z += (Math.random() - 0.5) * 1;
      }
    });
  
    renderer.render(scene, camera);
  }

// Generate initial stars and start the animation loop
generateStars();
animate();