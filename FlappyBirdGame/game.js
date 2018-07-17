
const population = 500;
var bird = [];
var paused;
var obs = [];
var score = 0;
var maxScore = 0;
var deadBirds = [];
var slider;
var count = 0;
var birdJSON;

function preload()
{
  birdJSON = loadJSON("bestBird.json");
}

function setup()
{
  createCanvas(600,700);
  slider = createSlider(1,10,1);

  for(let i=0;i<population;i++)
    bird[i] = new Bird();
}

function draw()
{
    background(240);
    // sky blue 0-191-255

    for(let x = 0; x < slider.value();x++)
    {
      if(bird.length == 0)
        restart();

      if(!paused)
      {
        if(count % 75 == 0)
        {
          obs.push(new Obstacle());
        }
        count++;

        for(let i=bird.length-1;i>=0;i--)
        {
          bird[i].update();
          if(obs.length > 0)
            bird[i].predict(obs);
        }

        for(let x=obs.length-1;x >= 0;x--)
        {
          obs[x].update();


          for(let j=bird.length-1;j>=0;j--)
          {
            if(obs[x].collides(bird[j]) || bird[j].offscreen())
            {
              deadBirds.push(bird.splice(j,1)[0]);
            }
            else {
              if(obs[x].pass(bird[j]))
                  score++;
            }
          }

          if(obs[x].offscreen())
          {
            obs.splice(x,1);
          }
        }
      }
    }

    for(let o of obs)
    {
      o.show();
    }

    for(let b of bird)
      b.show();

    showScore();
}

function restart()
{
  nextGeneration();
  resetGame();
  loop();
}

function resetGame()
{
    count = 0;
    obs = [];
    paused = false;
    maxScore = max(score,maxScore);
    score = 0;
}

function keyPressed()
{
  if(key == ' ')
  {
    bird.lift();
  }

  if(key == 'P')
  {
    paused = !paused;
  }

  if(key == 'E')
  {
    restart();
  }

  if(key == 'S')
  {
    let bestBird;
    let max = -Infinity;

    for(let b of bird)
    {
      let birdScore = b.gascore;

      if(birdScore > max)
      {
        bestBird = b;
        max = birdScore;
      }
    }

    console.log("Saved the best bird yet!");
    saveJSON(bestBird.brain,"bestBird.json");
  }
}

function loadBird(bestBirdJSON)
{
  let bestBird = NeuralNetwork.deserialize(bestBirdJSON);
  population = 1;
  bird[0] = new Bird(bestBird);
}

function showScore()
{
  fill(0);
  textSize(25);
  text("Score: "+score,50,50);
  text("Highscore: "+maxScore,50,100);
}
