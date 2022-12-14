  // Tableau pour stocker nos objets 
  var snowflakes = [];

  // Variables globales pour stocker la taille de la fenêtre de notre navigateur
  var browserWidth;
  var browserHeight;

  // Specify the number of snowflakes you want visible
  var numberOfSnowflakes = 50;

  // Flag to reset the position of the snowflakes
  var resetPosition = false;

  // Handle accessibility
  var enableAnimations = false;
  var reduceMotionQuery = matchMedia("(prefers-reduced-motion)");

  // Handle animation accessibility preferences 
  function setAccessibilityState() {
    if (reduceMotionQuery.matches) {
      enableAnimations = false;
    } else {
      enableAnimations = true;
    }
  }
  setAccessibilityState();

  reduceMotionQuery.addListener(setAccessibilityState);

  //
  // It all starts here...
  //
  function setup() {
    if (enableAnimations) {
      window.addEventListener("DOMContentLoaded", generateSnowflakes, false);
      window.addEventListener("resize", setResetFlag, false);
    }
  }
  setup();

  //
  // Constructeur de Flocon de neige
  //
  function Snowflake(element, vitesse, xPos, yPos) {
    // propriétés initiales du flocon de neige
    this.element = element;
    this.vitesse = vitesse;
    this.xPos = xPos;
    this.yPos = yPos;
    this.scale = 1;

    // les variables utilisées pour le mouvement de Flocon de neige
    this.compteur = 0;
    this.sign = Math.random() < 0.5 ? 1 : -1;

    // opacité et une taille initiales pour les flocon de neige
    this.element.style.opacity = (.1 + Math.random()) / 3;
  }

  //
  // La fonction responsable du déplacement de notre flocon de neige
  //
  Snowflake.prototype.update = function() {
    // détermination de notre position x et y
    this.compteur += this.vitesse / 5000;
    this.xPos += this.sign * this.vitesse * Math.cos(this.compteur) / 40;
    this.yPos += Math.sin(this.compteur) / 40 + this.vitesse / 30;
    this.scale = .5 + Math.abs(10 * Math.cos(this.compteur) / 20);

    // position des notre flocon de neige
    setTransform(Math.round(this.xPos), Math.round(this.yPos), this.scale, this.element);

    // Si flocon de neige passe sous la fenêtre du navigateur, passe vers le haut
    if (this.yPos > browserHeight) {
      this.yPos = -50;
    }
  }

  //
  //  Un moyen performant de définir la position et la taille de votre flocon de neige
  //
  function setTransform(xPos, yPos, scale, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0) scale(${scale}, ${scale})`;
  }

  //
  // The function responsible for creating the snowflake
  //
  function generateSnowflakes() {

    // get our snowflake element from the DOM and store it
    var originalSnowflake = document.querySelector(".snowflake");

    // access our snowflake element's parent container
    var snowflakeContainer = originalSnowflake.parentNode;
    snowflakeContainer.style.display = "block";

    // get our browser's size
    browserWidth = document.documentElement.clientWidth;
    browserHeight = document.documentElement.clientHeight;

    // create each individual snowflake
    for (var i = 0; i < numberOfSnowflakes; i++) {

      // clone our original snowflake and add it to snowflakeContainer
      var snowflakeClone = originalSnowflake.cloneNode(true);
      snowflakeContainer.appendChild(snowflakeClone);

      // set our snowflake's initial position and related properties
      var initialXPos = getPosition(50, browserWidth);
      var initialYPos = getPosition(50, browserHeight);
      var vitesse = 5 + Math.random() * 40;

      // create our Snowflake object
      var snowflakeObject = new Snowflake(snowflakeClone,
        vitesse,
        initialXPos,
        initialYPos);
      snowflakes.push(snowflakeObject);
    }

    // remove the original snowflake because we no longer need it visible
    snowflakeContainer.removeChild(originalSnowflake);

    moveSnowflakes();
  }

  //
  // Responsible for moving each snowflake by calling its update function
  //
  function moveSnowflakes() {

    if (enableAnimations) {
      for (var i = 0; i < snowflakes.length; i++) {
        var snowflake = snowflakes[i];
        snowflake.update();
      }
    }

    // Reset the position of all the snowflakes to a new value
    if (resetPosition) {
      browserWidth = document.documentElement.clientWidth;
      browserHeight = document.documentElement.clientHeight;

      for (var i = 0; i < snowflakes.length; i++) {
        var snowflake = snowflakes[i];

        snowflake.xPos = getPosition(50, browserWidth);
        snowflake.yPos = getPosition(50, browserHeight);
      }

      resetPosition = false;
    }

    requestAnimationFrame(moveSnowflakes);
  }

  //
  // This function returns a number between (maximum - offset) and (maximum + offset)
  //
  function getPosition(offset, size) {
    return Math.round(-1 * offset + Math.random() * (size + 2 * offset));
  }

  //
  // Trigger a reset of all the snowflakes' positions
  //
  function setResetFlag(e) {
    resetPosition = true;
  }