/*
  ____            _              ____      _       
 |  _ \ ___  __ _| | ___  __ _  |  _ \ ___| |_ ___ 
 | |_) / _ \/ _` | |/ _ \/ _` | | |_) / _ \ __/ _ \
 |  __/  __/ (_| | |  __/ (_| | |  __/  __/ ||  __/
 |_|   \___|\__, |_|\___|\__, | |_|   \___|\__\___|
  _____ _   |___/    ____|___/         _           
 |_   _| |__   ___  |  _ \(_)_ __ __ _| |_ ___     
   | | | '_ \ / _ \ | |_) | | '__/ _` | __/ _ \    
   | | | | | |  __/ |  __/| | | | (_| | ||  __/    
   |_| |_| |_|\___| |_|   |_|_|  \__,_|\__\___|   
*/

// ---------------------------------
// Global variables
// ---------------------------------
var gameChar;
var floorPos_y;
var scrollPos;
var gravity; // fall rate
var plummetRate; //Canyon fall rate

var flagpole;
var lifeToken;

//Score and life count variables
var game_score;
var lifeAssigned = false;

//Character movement control variables
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var isJumping;

//Variables used for restricting character x position when falling down a canyon
var currentCanyonLeftSide;
var currentCanyonRightSide;

//Sound effect variables
var jumpSound;
var backgroundMusic;
var collectableSound;
var gameOverSound;
var gameOverSound_played;
var deathSound;
var deathSound_played;
var victorySound;
var victorySound_played;
var enemySplatSound;

//Preload music and sound effects
function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.02);
    
    backgroundMusic = loadSound('assets/backgroundMusic.wav');
    backgroundMusic.setVolume(0.08);
    
    collectableSound = loadSound('assets/chaChing.wav');
    collectableSound.setVolume(0.1);
    
    gameOverSound = loadSound('assets/gameOver.wav');
    gameOverSound.setVolume(0.3);
    
    deathSound = loadSound('assets/deathSound.mp3');
    deathSound.setVolume(0.1);
    
    victorySound = loadSound('assets/victorySound.wav');
    victorySound.setVolume(0.3);
    
    enemySplatSound = 
    loadSound('assets/skeletonSplat.wav');
    enemySplatSound.setVolume(0.1);
}

//Contains all elements relating to player character
gameChar = {
    x: 0,
    y: 0,
    lives: 0,

//  Variable to store the real position of the gameChar in the game
//  world. Needed for collision detection.
    world_x: this.x - scrollPos,

//  Instructions for drawing game character in different directional states    
    drawGameChar: function()
    {
        strokeWeight(0)
        if (isLeft && isFalling)
        {
            // jumping-left code
            fill(220, 20, 60);
            ellipse(this.x, this.y-35,15,35); //body 

            fill(82, 40, 20)
            triangle(this.x, this.y-21, 
                     this.x, this.y-27,
                     this.x -20, this.y-24); //Pegleg

            fill(0);
            arc(this.x, this.y -27, 13, 20, 0, PI, CHORD); //Top of trousers
            fill(255,228,225);
            ellipse(this.x,this.y - 60,20,20); //Head

            fill(0);
            stroke(0);
            strokeWeight(2);
            arc(this.x -4, this.y -61, 4, 4, 0, PI, CHORD); //eyepatch
        }
        else if(isRight && isFalling)
        {
            // jumping-right code
            fill(220, 20, 60);
            ellipse(this.x, this.y-35,15,35) //body 

            fill(0);
            rect(this.x,this.y-25,22,5); //Right leg
            arc(this.x, this.y -27, 13, 20, 0, PI, CHORD); //Top of trousers

            fill(255,228,225);
            ellipse(this.x,this.y - 60,20,20); //Head

            fill(0);
            stroke(0);
            strokeWeight(2);
            line(this.x+3, this.y - 61, 
                 this.x +6, this.y - 61);
        }
        else if(isLeft)
        {
            // walking left code
            fill(220, 20, 60);
            ellipse(this.x, this.y-35,15,35); //body 

            fill(82, 40, 20)
            triangle(this.x - 3, this.y-22, 
                     this.x + 3, this.y-22,
                     this.x, this.y); //Pegleg

            fill(0);
            arc(this.x, this.y -27, 13, 20, 0, PI, CHORD); //Top of trousers
            fill(255,228,225);
            ellipse(this.x,this.y - 60,20,20); //Head

            fill(0);
            stroke(0);
            strokeWeight(2);
            arc(this.x -4, this.y -61, 4, 4, 0, PI, CHORD); //eyepatch
        }
        else if(isRight)
        {
            // walking right code
            fill(220, 20, 60);
            ellipse(this.x, this.y-35,15,35) //body 

            fill(0);
            rect(this.x-2.5,this.y-22,5,22); //Right leg

            arc(this.x, this.y -27, 13, 20, 0, PI, CHORD); //Top of trousers
            fill(255,228,225);
            ellipse(this.x,this.y - 60,20,20); //Head

            fill(0);
            stroke(0);
            strokeWeight(2);
            ellipse(this.x +4, this.y - 60, 1,1); //eye
        }
        else if(isFalling || isPlummeting)
        {
            // jumping facing forwards code
            fill(220, 20, 60);
            ellipse(this.x, this.y-35,25,35); //body 

            fill(82, 40, 20);
            triangle(this.x + 2, this.y-22, 
                     this.x + 8, this.y-22,
                     this.x + 5, this.y-10); //Pegleg

            fill(0);
            rect(this.x -8,this.y-22,5,12); //Right leg
            arc(this.x, this.y -27, 22, 20, 0, PI, CHORD); //Top of trousers

            fill(255,228,225);
            ellipse(this.x,this.y - 60,20,20); //Head

            fill(0);
            stroke(0);
            strokeWeight(2);
            line(this.x-5, this.y - 61, this.x -2, this.y - 61); //Shut eye
            arc(this.x +3, this.y -61, 4, 4, 0, PI, CHORD); //eyepatch
        }
        else
        {
            // front facing code
            fill(220, 20, 60);
            ellipse(this.x, this.y-35,25,35) //body 

            fill(82, 40, 20)
            triangle(this.x + 2, this.y-22, 
                     this.x + 8, this.y-22,
                     this.x +5, this.y); //Pegleg
            noStroke();

            fill(0);
            rect(this.x -8,this.y-22,5,22); //Right leg
            arc(this.x, this.y -27, 22, 20, 0, PI, CHORD); //Top of trousers
            fill(255,228,225);
            ellipse(this.x,this.y - 60,20,20); //Head

            fill(0);
            stroke(0);
            strokeWeight(2);
            ellipse(this.x - 3, this.y - 60, 1,1); //eye
            arc(this.x +3, this.y -61, 4, 4, 0, PI, CHORD); //eyepatch
            strokeWeight(1); //Reset
        }
    },
    
//  Checks how many treasures the player has collected since last game over. Every three treasures adds 1 additional life    
    checkTreasure: function()
    {
        var treasure = game_score;
        var t = treasure % 3;

        if(treasure > 0 && t == 0 && lifeAssigned == false)
        {
            this.lives += 1;
            lifeAssigned = true;
        }
        if(!t == 0)
        {
            lifeAssigned = false;
        }
    }
}

//Creates an instance of a skeleton enemy; contains methods to update its x_position for movement, change to a squashed state
//if killed by player and draw functions. NOTE to prevent enemies from killing player for testing purposes, set this.isThreat to false.
function Skeleton(x, y, size, range, startingDirection)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.size = size;
    this.isSquashed = false; //bool val indicates whether or not enemy is dead
    this.squashFactor = 0; //translates skull to floor for squashed state
    this.isThreat = true; //indicates whether enemy is a threat to player - true when alive, false when killed
    this.splatSoundPlayed = false; //Makes sure that each skeleton's death sound only plays once
    this.startingDirection = startingDirection;
    this.overCanyon = false;
    
    this.currentX = x;
    this.inc = startingDirection; //parsed value should be positive or negative to change direction
    
//  Contains instructions for drawing skeletons in alive and dead states
    this.draw = function()
    {
        this.update(); //Updates skeleton's position and state each frame

        //Skull white
        fill(255);
        noStroke();
        ellipse(this.currentX, this.y-60*this.size+this.squashFactor, 20*this.size,23*this.size);
        rect(this.currentX-5*this.size, this.y-55*this.size+this.squashFactor, 10*this.size, 10*this.size);

        //Black skull eyes - only visible when skeleton squashed
        noStroke();
        fill(0);
        ellipse(this.currentX-5*this.size, this.y-60*this.size+this.squashFactor, 8*this.size, 8*this.size); //Left
        ellipse(this.currentX+5*this.size, this.y-60*this.size+this.squashFactor, 8*this.size, 8*this.size);//right

        //Teeth
        noFill();
        stroke(0);
        strokeWeight(0.3*this.size);
        for(var i = 0; i < 6; i++)
        {
           for(var j = 0; j < 2; j++)
            {
            rect(this.currentX-3*this.size+i*this.size, this.y-51*this.size+j*2*this.size+this.squashFactor, 1*this.size, 2*this.size);    
            }
        }

        if(this.isSquashed == false) //Only draws body if skeleton has not been squashed
        {
            //Yellow and red skull eyes
            noStroke();
            fill(255,0,0);
            ellipse(this.currentX-5*this.size, this.y-60*this.size+this.squashFactor, 8*this.size, 8*this.size); //Left
            ellipse(this.currentX+5*this.size, this.y-60*this.size+this.squashFactor, 8*this.size, 8*this.size);//right

            //Yellow fade pupils
            size = 0.8
            for(var i = 1; i < 11; i++)
            {
                fill(255,255,0, 255-i*25.5)
                ellipse(this.currentX-5*this.size, this.y-60*this.size+this.squashFactor, size*i*this.size)
                ellipse(this.currentX+5*this.size, this.y-60*this.size+this.squashFactor, size*i*this.size)
            }
            
            //spine
            stroke(255);
            strokeWeight(4*this.size);
            line(this.currentX, this.y-40*this.size, this.currentX, this.y-20*this.size)

            //ribs
            strokeWeight(3*this.size);
            line(this.currentX-10*this.size, this.y-40*this.size, this.currentX-4*this.size, this.y- 38*this.size);
            line(this.currentX-10*this.size, this.y-35*this.size, this.currentX-4*this.size, this.y- 33*this.size);
            line(this.currentX-10*this.size, this.y-30*this.size, this.currentX-4*this.size, this.y- 28*this.size);
            line(this.currentX+10*this.size, this.y-40*this.size, this.currentX+4*this.size, this.y- 38*this.size);
            line(this.currentX+10*this.size, this.y-35*this.size, this.currentX+4*this.size, this.y- 33*this.size);
            line(this.currentX+10*this.size, this.y-30*this.size, this.currentX+4*this.size, this.y- 28*this.size);

            //Pelvis
            triangle(this.currentX-5*this.size, this.y-20*this.size, this.currentX+5*this.size, this.y-20*this.size, this.currentX, this.y-17*this.size);

            //legs
            strokeWeight(4*this.size);
            line(this.currentX-6*this.size, this.y-16*this.size, this.currentX-6*this.size, this.y);
            line(this.currentX+6*this.size, this.y-16*this.size, this.currentX+6*this.size, this.y)
        }
    }
    
//  Updates position and state of the skeleton each frame
    this.update = function()
    {
        if(!this.isSquashed) //makes sure if squashed the skeleton stops moving
        {
            this.currentX += this.inc            

            if(this.currentX >= this.x + this.range)
            {
                this.inc = -1;
            }
            else if(this.currentX <= this.x - this.range)
            {
                this.inc = 1;
            }
         }
        
        if(this.isSquashed == true)
        {
            this.squashFactor = 45*this.size;
        }
        else
        {
            this.squashFactor = 0;
        }
    }
    
//  When contact is made between skeleton and player, checks whether skeleton should die or player should die. Plays appropriate sound
//  and removes player lives as appropriate
    this.checkContact = function(gc_x, gc_y)
    {
        if(gc_y < this.y-35*this.size && abs(this.currentX-gc_x) < 10)
        {    
            if(this.splatSoundPlayed == false)
            {
                enemySplatSound.play();
                this.splatSoundPlayed = true;
            }
            this.isSquashed = true;
            this.isThreat = false; //Ensures the skeleton cannot kill the player once squashed
        }
        else if(gc_y > this.y-35*this.size && abs(this.currentX-gc_x) < 10 && this.isThreat == true)
        {
            if(gameChar.lives > 0) //If player still has lives, play death sound, stop music, remove a life and restart the game
            {
                backgroundMusic.stop();
                gameChar.lives -= 1;
                deathSound.play();
                startGame();
            }
        }
    }
    
    
    
}

//Contains objects and arrays of scenery, and draw function for scenery. After the first level is complete, the createNewLevel function 
//is used to clear these arrays and generate new ones to create a randomly generated level and ensures that scenery objects are nicely placed and do
//not overlap where this would be inappropriate - eg. mountains over canyons or treasures over canyons.
level = 
{
    mountains: 
    [
        {
        x_pos: 500,
        y_pos: floorPos_y,
        size: 40
        },
        
        {
        x_pos: 280,
        y_pos: floorPos_y,
        size: 100
        },
        
        {
        x_pos: 900,
        y_pos: floorPos_y,
        size: 70
        },
        
        {
        x_pos: 1100,
        y_pos: floorPos_y,
        size: 40
        },
        
        {
        x_pos: 1400,
        y_pos: floorPos_y,
        size: 85
        },
        
        {
        x_pos: 1550,
        y_pos: floorPos_y,
        size: 70
        },
        
        {
        x_pos: 1850,
        y_pos: floorPos_y,
        size: 40
        },
        
        {
        x_pos: 2200,
        y_pos: floorPos_y,
        size: 100
        },
        
        {
        x_pos: 2400,
        y_pos: floorPos_y,
        size: 70
        },
        
        {
        x_pos: 2700,
        y_pos: floorPos_y,
        size: 40
        },
        
        {
        x_pos: 3000,
        y_pos: floorPos_y,
        size: 85
        },
        
        {
        x_pos: 3300,
        y_pos: floorPos_y,
        size: 70
        }
    ],
    
    trees: 
    [
        {
            x_pos: 200,
            size: 1,
        },
        {
            x_pos: 800,
            size: 0.8,
        },
        {
            x_pos: 1050,
            size: 0.8,
        },
        {
            x_pos: 1400,
            size: 0.9,
        },
        {
            x_pos: 1650,
            size: 1.05,
        },
        {
            x_pos: 1900,
            size: 1,
        },
        {
            x_pos: 2515,
            size: 0.9,
        },
        {
            x_pos: 2950,
            size: 0.7,
        },
        {
            x_pos: 3525,
            size: 0.8,
        },
    ],
    
    enemies: [],    
    
    clouds: 
    [
        {
        x_pos: 200,
        y_pos: 120,
        size: 100
        }, 

        {
        x_pos: 400,
        y_pos: 170,
        size: 60
        }, 
        
        {
        x_pos: 700,
        y_pos: 100,
        size: 90
        },       
        
        {
        x_pos: 1000,
        y_pos: 115,
        size: 70
        }, 

        {
        x_pos: 1300,
        y_pos: 120,
        size: 60
        }, 
        
        {
        x_pos: 1500,
        y_pos: 100,
        size: 100
        },  
        
        {
        x_pos: 1800,
        y_pos: 120,
        size: 100
        },
        
        {
        x_pos: 2300,
        y_pos: 120,
        size: 100
        }, 

        {
        x_pos: 2700,
        y_pos: 170,
        size: 60
        }, 
        
        {
        x_pos: 3000,
        y_pos: 100,
        size: 90
        },       
        
        {
        x_pos: 3200,
        y_pos: 115,
        size: 70
        }, 

        {
        x_pos: 3600,
        y_pos: 120,
        size: 60
        }, 
        
        {
        x_pos: 3800,
        y_pos: 100,
        size: 100
        }
    ],   

    canyons: 
    [
        {
        x_pos: 20,
        width: 150
        },
        
        {
        x_pos: 700,
        width: 70
        },
        
        {
        x_pos: 1750,
        width: 85
        },
        
        {
        x_pos: 2000,
        width: 105
        },
        
        {
        x_pos: 2600,
        width: 75
        },
        
        {
        x_pos: 3200,
        width: 100
        }
    ],
    
    collectables: 
    [
        {
        x_pos: 300, 
        y_pos: floorPos_y, 
        size: 100,
        isFound: false
        },
        
        {
        x_pos: 1350, 
        y_pos: floorPos_y, 
        size: 100,
        isFound: false
        },
        
        {
        x_pos: 2100, 
        y_pos: floorPos_y, 
        size: 100,
        isFound: false
        },
        
        {
        x_pos: 2500, 
        y_pos: floorPos_y, 
        size: 100,
        isFound: false
        }
    ],
    
    drawTrees: function()
    {
        for (i = 0; i < this.trees.length; i++)
        {
            factor = this.trees[i].size
            strokeWeight(3*factor);
            //Draw a stack of triangles transforming in both axis to create slightly bent palm tree trunk
            stroke(160, 82, 45);
            fill(205, 133, 63)

            triangle(this.trees[i].x_pos, floorPos_y, 
                     this.trees[i].x_pos+30*factor, floorPos_y, 
                     this.trees[i].x_pos+15*factor, floorPos_y-20*factor);
            triangle(this.trees[i].x_pos+4*factor, floorPos_y-10*factor, 
                     this.trees[i].x_pos+34*factor, floorPos_y-10*factor, 
                     this.trees[i].x_pos+19*factor, floorPos_y-30*factor);
            triangle(this.trees[i].x_pos+9*factor, floorPos_y-20*factor, 
                     this.trees[i].x_pos+38*factor, floorPos_y-20*factor, 
                     this.trees[i].x_pos+23*factor, floorPos_y-40*factor);
            triangle(this.trees[i].x_pos+13*factor, floorPos_y-30*factor, 
                     this.trees[i].x_pos+42*factor, floorPos_y-30*factor, 
                     this.trees[i].x_pos+27*factor, floorPos_y-50*factor);
            triangle(this.trees[i].x_pos+16*factor, floorPos_y-40*factor, 
                     this.trees[i].x_pos+45*factor, floorPos_y-40*factor, 
                     this.trees[i].x_pos+30*factor, floorPos_y-60*factor);
            triangle(this.trees[i].x_pos+19*factor, floorPos_y-50*factor, 
                     this.trees[i].x_pos+48*factor, floorPos_y-50*factor, 
                     this.trees[i].x_pos+33*factor, floorPos_y-70*factor);
            triangle(this.trees[i].x_pos+21*factor, floorPos_y-60*factor, 
                     this.trees[i].x_pos+50*factor, floorPos_y-60*factor, 
                     this.trees[i].x_pos+35*factor, floorPos_y-80*factor);
            triangle(this.trees[i].x_pos+23*factor, floorPos_y-70*factor, 
                     this.trees[i].x_pos+52*factor, floorPos_y-70*factor, 
                     this.trees[i].x_pos+37*factor, floorPos_y-90*factor);
            triangle(this.trees[i].x_pos+25*factor, floorPos_y-80*factor, 
                     this.trees[i].x_pos+54*factor, floorPos_y-80*factor, 
                     this.trees[i].x_pos+39*factor, floorPos_y-100*factor);
            triangle(this.trees[i].x_pos+27*factor, floorPos_y-90*factor, 
                     this.trees[i].x_pos+56*factor, floorPos_y-90*factor,
                     this.trees[i].x_pos+41*factor, floorPos_y-110*factor);
            triangle(this.trees[i].x_pos+27*factor, floorPos_y-100*factor, 
                     this.trees[i].x_pos+56*factor, floorPos_y-100*factor, 
                     this.trees[i].x_pos+41*factor, floorPos_y-120*factor);
            triangle(this.trees[i].x_pos+25*factor, floorPos_y-110*factor, 
                     this.trees[i].x_pos+54*factor, floorPos_y-110*factor, 
                     this.trees[i].x_pos+39*factor, floorPos_y-130*factor);
            triangle(this.trees[i].x_pos+25*factor, floorPos_y-110*factor, 
                     this.trees[i].x_pos+54*factor, floorPos_y-110*factor, 
                     this.trees[i].x_pos+39*factor, floorPos_y-130*factor);
            triangle(this.trees[i].x_pos+23*factor, floorPos_y-120*factor, 
                     this.trees[i].x_pos+52*factor, floorPos_y-120*factor, 
                     this.trees[i].x_pos+37*factor, floorPos_y-140*factor);
            triangle(this.trees[i].x_pos+21*factor, floorPos_y-130*factor, 
                     this.trees[i].x_pos+50*factor, floorPos_y-130*factor, 
                     this.trees[i].x_pos+35*factor, floorPos_y-150*factor);

            //Draw leaves using triangles
            stroke(0, 100, 0);
            fill(34, 139, 34);

            triangle(this.trees[i].x_pos-45*factor, floorPos_y-165*factor, 
                     this.trees[i].x_pos-80*factor, floorPos_y-140*factor, 
                     this.trees[i].x_pos-30*factor, floorPos_y-145*factor);
            triangle(this.trees[i].x_pos+35*factor, floorPos_y-150*factor, 
                     this.trees[i].x_pos-50*factor, floorPos_y-170*factor, 
                     this.trees[i].x_pos-35*factor, floorPos_y-140*factor);

            triangle(this.trees[i].x_pos+8*factor, floorPos_y-200*factor, 
                     this.trees[i].x_pos, floorPos_y-183*factor, 
                     this.trees[i].x_pos-43*factor, floorPos_y-172*factor);
            triangle(this.trees[i].x_pos+35*factor, floorPos_y-150*factor, 
                     this.trees[i].x_pos+7*factor, floorPos_y-201*factor, 
                     this.trees[i].x_pos-1*factor, floorPos_y-182*factor);

            triangle(this.trees[i].x_pos-36*factor, floorPos_y-197*factor,
                     this.trees[i].x_pos-50*factor, floorPos_y-183*factor, 
                     this.trees[i].x_pos-90*factor, floorPos_y-180*factor);
            triangle(this.trees[i].x_pos+35*factor, floorPos_y-150*factor, 
                     this.trees[i].x_pos-39*factor, floorPos_y-199*factor, 
                     this.trees[i].x_pos-52*factor, floorPos_y-182*factor);

            triangle(this.trees[i].x_pos+65*factor, floorPos_y-192*factor, 
                     this.trees[i].x_pos+64*factor, floorPos_y-177*factor, 
                     this.trees[i].x_pos+102*factor, floorPos_y-152*factor);
            triangle(this.trees[i].x_pos+35*factor, floorPos_y-150*factor, 
                     this.trees[i].x_pos+66*factor, floorPos_y-193*factor, 
                     this.trees[i].x_pos+65*factor, floorPos_y-176*factor);

            triangle(this.trees[i].x_pos+97*factor, floorPos_y-182*factor, 
                     this.trees[i].x_pos+97*factor, floorPos_y-166*factor, 
                     this.trees[i].x_pos+133*factor, floorPos_y-152*factor);
            triangle(this.trees[i].x_pos+35*factor, floorPos_y-150*factor, 
                     this.trees[i].x_pos+98*factor, floorPos_y-183*factor,
                     this.trees[i].x_pos+98*factor, floorPos_y-165*factor);

            triangle(this.trees[i].x_pos+98*factor, floorPos_y-138*factor, 
                     this.trees[i].x_pos+90*factor, floorPos_y-130*factor, 
                     this.trees[i].x_pos+119*factor, floorPos_y-113*factor);
            triangle(this.trees[i].x_pos+35*factor, floorPos_y-150*factor, 
                     this.trees[i].x_pos+99*factor, floorPos_y-141*factor, 
                     this.trees[i].x_pos+91*factor, floorPos_y-127*factor);

            //Add coconuts to palm tree
            stroke(82, 40, 20);
            fill(122, 59, 16);
            ellipse(this.trees[i].x_pos+40*factor, floorPos_y-153*factor, 20*factor, 25*factor)
            ellipse(this.trees[i].x_pos+25*factor, floorPos_y-150*factor, 20*factor, 25*factor);
            stroke(82, 40, 20);
            point(this.trees[i].x_pos+26*factor, floorPos_y-152*factor) //Three dots in left coconut
            point(this.trees[i].x_pos+29*factor, floorPos_y-155*factor)
            point(this.trees[i].x_pos+31*factor, floorPos_y-151*factor)
            point(this.trees[i].x_pos+46*factor, floorPos_y-157*factor) //Three dots in right coconut
            point(this.trees[i].x_pos+43*factor, floorPos_y-154*factor)
            point(this.trees[i].x_pos+47*factor, floorPos_y-152*factor)

            strokeWeight(1);//Reset strokeWeight
        }
    },
    
    drawMountains: function()
    {
        for (i = 0; i < this.mountains.length; i++)
        {
            fill(102, 118, 134);
            beginShape();
            vertex(this.mountains[i].x_pos, this.mountains[i].y_pos);
            vertex(this.mountains[i].x_pos+57*this.mountains[i].size/100, this.mountains[i].y_pos-89*this.mountains[i].size/100);
            vertex(this.mountains[i].x_pos+98*this.mountains[i].size/100, this.mountains[i].y_pos-235*this.mountains[i].size/100);
            vertex(this.mountains[i].x_pos+106*this.mountains[i].size/100, this.mountains[i].y_pos-227*this.mountains[i].size/100);
            vertex(this.mountains[i].x_pos+125*this.mountains[i].size/100, this.mountains[i].y_pos-227*this.mountains[i].size/100);
            vertex(this.mountains[i].x_pos+142*this.mountains[i].size/100, this.mountains[i].y_pos-230*this.mountains[i].size/100);
            vertex(this.mountains[i].x_pos+163*this.mountains[i].size/100, this.mountains[i].y_pos-247*this.mountains[i].size/100);
            vertex(this.mountains[i].x_pos+175*this.mountains[i].size/100, this.mountains[i].y_pos-159*this.mountains[i].size/100);
            vertex(this.mountains[i].x_pos+218*this.mountains[i].size/100, this.mountains[i].y_pos-70*this.mountains[i].size/100);
            vertex(this.mountains[i].x_pos+275*this.mountains[i].size/100, this.mountains[i].y_pos);
            endShape();

            //Add detail to mountain to create illusion of depth
            fill(152, 168, 184);
            triangle(this.mountains[i].x_pos+21*this.mountains[i].size/100, this.mountains[i].y_pos, 
                     this.mountains[i].x_pos+41*this.mountains[i].size/100, this.mountains[i].y_pos, 
                     this.mountains[i].x_pos+90*this.mountains[i].size/100, this.mountains[i].y_pos-132*this.mountains[i].size/100);
            triangle(this.mountains[i].x_pos+60*this.mountains[i].size/100, this.mountains[i].y_pos, 
                     this.mountains[i].x_pos+80*this.mountains[i].size/100, this.mountains[i].y_pos, 
                     this.mountains[i].x_pos+110*this.mountains[i].size/100, this.mountains[i].y_pos-152*this.mountains[i].size/100);
            triangle(this.mountains[i].x_pos+100*this.mountains[i].size/100, this.mountains[i].y_pos, 
                     this.mountains[i].x_pos+150*this.mountains[i].size/100, this.mountains[i].y_pos, 
                     this.mountains[i].x_pos+125*this.mountains[i].size/100, this.mountains[i].y_pos-102*this.mountains[i].size/100);
            triangle(this.mountains[i].x_pos+180*this.mountains[i].size/100, this.mountains[i].y_pos, 
                     this.mountains[i].x_pos+200*this.mountains[i].size/100, this.mountains[i].y_pos, 
                     this.mountains[i].x_pos+150*this.mountains[i].size/100, this.mountains[i].y_pos-152*this.mountains[i].size/100);
            triangle(this.mountains[i].x_pos+220*this.mountains[i].size/100, this.mountains[i].y_pos, 
                     this.mountains[i].x_pos+245*this.mountains[i].size/100, this.mountains[i].y_pos, 
                     this.mountains[i].x_pos+165*this.mountains[i].size/100, this.mountains[i].y_pos-142*this.mountains[i].size/100);
        }
    },
    
    drawClouds: function()
    {
        for (i = 0; i < this.clouds.length; i++)
        {
            //Draw a cloud
            stroke(0);
            strokeWeight(3*this.clouds[i].size/100);

            fill(135, 206, 250);
            ellipse(this.clouds[i].x_pos, this.clouds[i].y_pos, 
                    60*this.clouds[i].size/100, 60*this.clouds[i].size/100);
            ellipse(this.clouds[i].x_pos-30*this.clouds[i].size/100, this.clouds[i].y_pos-5*this.clouds[i].size/100, 
                    60*this.clouds[i].size/100, 60*this.clouds[i].size/100);
            ellipse(this.clouds[i].x_pos+40*this.clouds[i].size/100, this.clouds[i].y_pos, 
                    60*this.clouds[i].size/100, 60*this.clouds[i].size/100);

            //Draw white overlapping circles with borders to create edge of cloud
            fill(255)
            ellipse(this.clouds[i].x_pos+100*this.clouds[i].size/100, this.clouds[i].y_pos-20*this.clouds[i].size/100, 
                    50*this.clouds[i].size/100, 50*this.clouds[i].size/100);
            ellipse(this.clouds[i].x_pos+80*this.clouds[i].size/100, this.clouds[i].y_pos-10*this.clouds[i].size/100, 
                    60*this.clouds[i].size/100, 60*this.clouds[i].size/100);
            ellipse(this.clouds[i].x_pos+93*this.clouds[i].size/100, this.clouds[i].y_pos-40*this.clouds[i].size/100, 
                    50*this.clouds[i].size/100, 50*this.clouds[i].size/100);
            ellipse(this.clouds[i].x_pos+125*this.clouds[i].size/100, this.clouds[i].y_pos-20*this.clouds[i].size/100, 
                    20*this.clouds[i].size/100, 20*this.clouds[i].size/100);
            ellipse(this.clouds[i].x_pos+70*this.clouds[i].size/100, this.clouds[i].y_pos-50*this.clouds[i].size/100, 
                    40*this.clouds[i].size/100, 40*this.clouds[i].size/100);
            ellipse(this.clouds[i].x_pos+35*this.clouds[i].size/100, this.clouds[i].y_pos-50*this.clouds[i].size/100, 
                    60*this.clouds[i].size/100, 60*this.clouds[i].size/100);
            ellipse(this.clouds[i].x_pos+10*this.clouds[i].size/100, this.clouds[i].y_pos-50*this.clouds[i].size/100, 
                    40*this.clouds[i].size/100, 40*this.clouds[i].size/100);
            ellipse(this.clouds[i].x_pos-45*this.clouds[i].size/100, this.clouds[i].y_pos-30*this.clouds[i].size/100, 
                    50*this.clouds[i].size/100, 50*this.clouds[i].size/100);
            ellipse(this.clouds[i].x_pos-20*this.clouds[i].size/100, this.clouds[i].y_pos-45*this.clouds[i].size/100, 
                    40*this.clouds[i].size/100, 40*this.clouds[i].size/100);

            //Fill in middle of cloud with white borderless circles
            noStroke();
            fill(255);
            ellipse(this.clouds[i].x_pos-25*this.clouds[i].size/100, this.clouds[i].y_pos-10*this.clouds[i].size/100, 
                    60*this.clouds[i].size/100, 60*this.clouds[i].size/100);
            ellipse(this.clouds[i].x_pos+5*this.clouds[i].size/100, this.clouds[i].y_pos-8*this.clouds[i].size/100, 
                    60*this.clouds[i].size/100, 60*this.clouds[i].size/100);
            ellipse(this.clouds[i].x_pos+45*this.clouds[i].size/100, this.clouds[i].y_pos-5*this.clouds[i].size/100, 
                    60*this.clouds[i].size/100, 60*this.clouds[i].size/100);
            ellipse(this.clouds[i].x_pos+90*this.clouds[i].size/100, this.clouds[i].y_pos-25*this.clouds[i].size/100, 
                    60*this.clouds[i].size/100, 60*this.clouds[i].size/100);
            ellipse(this.clouds[i].x_pos+116*this.clouds[i].size/100, this.clouds[i].y_pos-20*this.clouds[i].size/100, 
                    20*this.clouds[i].size/100, 20*this.clouds[i].size/100);
            ellipse(this.clouds[i].x_pos+70*this.clouds[i].size/100, this.clouds[i].y_pos-30*this.clouds[i].size/100, 
                    60*this.clouds[i].size/100, 60*this.clouds[i].size/100);
            ellipse(this.clouds[i].x_pos+40*this.clouds[i].size/100, this.clouds[i].y_pos-35*this.clouds[i].size/100, 
                    60*this.clouds[i].size/100, 60*this.clouds[i].size/100);
            ellipse(this.clouds[i].x_pos+10*this.clouds[i].size/100, this.clouds[i].y_pos-30*this.clouds[i].size/100, 
                    60*this.clouds[i].size/100, 60*this.clouds[i].size/100);
            ellipse(this.clouds[i].x_pos-10*this.clouds[i].size/100, this.clouds[i].y_pos-25*this.clouds[i].size/100, 
                    60*this.clouds[i].size/100, 60*this.clouds[i].size/100);

            //Use similar process to before to create two pieces of detail for 3D effect on cloud
            stroke(0);
            fill(135, 206, 250);
            ellipse(this.clouds[i].x_pos, this.clouds[i].y_pos-20*this.clouds[i].size/100, 40*this.clouds[i].size/100, 40*this.clouds[i].size/100);
            fill(255);

            ellipse(this.clouds[i].x_pos+70*this.clouds[i].size/100, this.clouds[i].y_pos-20*this.clouds[i].size/100, 
                    40*this.clouds[i].size/100, 40*this.clouds[i].size/100);
            noStroke();
            ellipse(this.clouds[i].x_pos+5*this.clouds[i].size/100, this.clouds[i].y_pos-25*this.clouds[i].size/100, 
                    40*this.clouds[i].size/100, 40*this.clouds[i].size/100);
            ellipse(this.clouds[i].x_pos+60*this.clouds[i].size/100, this.clouds[i].y_pos-28*this.clouds[i].size/100, 
                    50*this.clouds[i].size/100, 50*this.clouds[i].size/100);
        }
    },
    
    drawCanyons: function()
    {
        for(var i = 0; i < this.canyons.length; i++)
        {
            //Draw canyon
            noStroke() //Sky background rectangle between canyon edges
            fill(100, 155, 255)
            rect(this.canyons[i].x_pos+15,432,115+this.canyons[i].width-100,144)
            fill(242, 209, 107);

            beginShape(); //Left canyon jagged wall
            vertex(this.canyons[i].x_pos, 432)
            vertex(this.canyons[i].x_pos+40, 432)
            vertex(this.canyons[i].x_pos+30, 490)
            vertex(this.canyons[i].x_pos+35, 520);
            vertex(this.canyons[i].x_pos+33, 535)
            vertex(this.canyons[i].x_pos+39, 576);
            vertex(this.canyons[i].x_pos, 576)
            vertex(this.canyons[i].x_pos, 432)
            endShape();

            beginShape(); //Right canyon jagged wall
            vertex(this.canyons[i].x_pos+170+this.canyons[i].width-100, 432) //Width of default canyon is 100. Operation '*this.canyons[i].width/100' adds or subtracts any change rather than a % scaling to prevent the shape changing
            vertex(this.canyons[i].x_pos+100+this.canyons[i].width-100, 432)
            vertex(this.canyons[i].x_pos+115+this.canyons[i].width-100, 460)
            vertex(this.canyons[i].x_pos+95+this.canyons[i].width-100, 490)
            vertex(this.canyons[i].x_pos+105+this.canyons[i].width-100, 530)
            vertex(this.canyons[i].x_pos+105+this.canyons[i].width-100, 576)
            vertex(this.canyons[i].x_pos+170+this.canyons[i].width-100, 576)
            vertex(this.canyons[i].x_pos+170+this.canyons[i].width-100, 432)
            endShape();
        }
    },
    
    drawCollectables: function()
    {
        // Draw collectable items.
        for(var i = 0; i < this.collectables.length; i++)
        {
            if(!this.collectables[i].isFound)
            {
                stroke(0);
                fill(130, 73, 11);
                ellipse(this.collectables[i].x_pos+9*this.collectables[i].size/100, this.collectables[i].y_pos-25*this.collectables[i].size/100, 
                        17*this.collectables[i].size/100, 30*this.collectables[i].size/100); //Left side of lid

                noStroke();
                rect(this.collectables[i].x_pos+9*this.collectables[i].size/100, this.collectables[i].y_pos-40*this.collectables[i].size/100, 
                     57*this.collectables[i].size/100, 30*this.collectables[i].size/100); //Rectangle to fill in middle of lid

                stroke(0);
                line(this.collectables[i].x_pos+9*this.collectables[i].size/100, this.collectables[i].y_pos-40*this.collectables[i].size/100, 
                     this.collectables[i].x_pos+68*this.collectables[i].size/100, this.collectables[i].y_pos-40*this.collectables[i].size/100);

                fill(93, 41, 6);
                ellipse(this.collectables[i].x_pos+67*this.collectables[i].size/100, this.collectables[i].y_pos-25*this.collectables[i].size/100, 
                        17*this.collectables[i].size/100, 30*this.collectables[i].size/100); //Right side of lid

                stroke(0);
                fill(130, 73, 11);
                rect(this.collectables[i].x_pos, this.collectables[i].y_pos-22*this.collectables[i].size/100, 
                     60*this.collectables[i].size/100, 32*this.collectables[i].size/100); //Front of chest

                fill(93, 41, 6);
                beginShape(); //Right side of chest
                vertex(this.collectables[i].x_pos+60*this.collectables[i].size/100, 
                       this.collectables[i].y_pos-22*this.collectables[i].size/100);
                vertex(this.collectables[i].x_pos+75*this.collectables[i].size/100, 
                       this.collectables[i].y_pos-32*this.collectables[i].size/100);
                vertex(this.collectables[i].x_pos+75*this.collectables[i].size/100, 
                       this.collectables[i].y_pos);
                vertex(this.collectables[i].x_pos+60*this.collectables[i].size/100, 
                       this.collectables[i].y_pos+10*this.collectables[i].size/100);
                vertex(this.collectables[i].x_pos+60*this.collectables[i].size/100, 
                       this.collectables[i].y_pos-22*this.collectables[i].size/100);
                endShape();

                fill(255, 215, 0); //padlock
                noStroke();
                ellipse(this.collectables[i].x_pos+30*this.collectables[i].size/100, this.collectables[i].y_pos-17*this.collectables[i].size/100, 
                        6*this.collectables[i].size/100, 6*this.collectables[i].size/100);
                triangle(this.collectables[i].x_pos+30*this.collectables[i].size/100, this.collectables[i].y_pos-17*this.collectables[i].size/100, 
                         this.collectables[i].x_pos+27*this.collectables[i].size/100, this.collectables[i].y_pos-8*this.collectables[i].size/100, 
                         this.collectables[i].x_pos+33*this.collectables[i].size/100, this.collectables[i].y_pos-8*this.collectables[i].size/100);
            }
        }
    },
    
//  Clears original scenery object arrays and generates random arrays without allowing forbidden positions. Always keeps the first
//  element of some arrays, including the left-most canyon which is sized to prevent the player from moving left at the start.
//  Default setting is to draw 5 canyons, 8-15 mountains, 20 clouds, 8-15 trees, 3 treasures and 8-15 enemies.
    createNewLevel: function()
    {
        //First clear existing elements from scenery arrays
        this.mountains.length = 0;
        this.trees.length = 1; //Keep first tree for positioning comparison
        this.clouds.length = 1; //Keep first cloud for first positioning comparison
        this.canyons.length = 1; //Keep far-left-hand canyon which prevents player from going left
        this.collectables.length = 0;
        this.enemies.length = 0;
        
        //Generate random positions and widths of canyons & prevent overlap
        for(var i = 0; i < 5; i++)
        {
            var c = new this.generateCanyonObj(random(0, 2600), random(70, 105));
            var potentialCanyon = []
            potentialCanyon.push(c);
            for(var j = 0; j < this.canyons.length; j++)
            {
                if(abs(potentialCanyon[0].x_pos - this.canyons[j].x_pos) < 300 || abs(potentialCanyon[0].x_pos - width/2) < 100)
                {
                    i -= 1;
                    potentialCanyon.length = 0; //Clear tested canyon when test fails
                    break;
                }
            }
            if(potentialCanyon.length > 0)
            {
                this.canyons.push(potentialCanyon[0])
                potentialCanyon.length = 0 //Clear ready for next iteration
            }
        }
        
        //Generate random positions and widths of mountains & prevent overlap with canyons
        for(var i = 0; i < random(8, 15); i++)
        {
            var c = new this.generateMountainObj(random(-200, 2900), floorPos_y, random(40, 100));
            var potentialMountain = []
            var shared_y = height * 3/4;
            potentialMountain.push(c);
            for(var j = 0; j < this.canyons.length; j++)
            {
                if((potentialMountain[0].x_pos < this.canyons[j].x_pos + this.canyons[j].width/2) && 
                    (potentialMountain[0].x_pos+275*potentialMountain[0].size/100 > this.canyons[j].x_pos + this.canyons[j].width/2) ||
                    (potentialMountain[0].x_pos < this.canyons[j].x_pos+this.canyons[j].width) && (potentialMountain[0].x_pos > this.canyons[j].x_pos) ||
                    (potentialMountain[0].x_pos > this.canyons[j].x_pos+this.canyons[j].width) && (potentialMountain[0].x_pos < this.canyons[j].x_pos))
                {
                    i -= 1;
                    potentialMountain.length = 0; //Clear tested mountain when test fails
                    break;
                }
            }
            if(potentialMountain.length > 0)
            {
                this.mountains.push(potentialMountain[0])
                potentialMountain.length = 0 //Clear ready for next iteration
            }
        }
        
        //Generate random positions and sizes of clouds
        for(var i = 0; i < 20; i++)
        {
            var cloud = new this.generateCloudObj(random(100, 3800), random(50, 140), random(60,100));
            var potentialCloud = []
            potentialCloud.push(cloud);
            
            for(var j = 0; j < this.clouds.length; j++)
            {
                var existingCloud = this.clouds[j]
                if(abs(existingCloud.x_pos - potentialCloud[0].x_pos) < 60)
                {
                    i -= 1;
                    potentialCloud.length = 0; //Clear tested cloud when test fails
                    break;
                }
            }
            if(potentialCloud.length > 0)
            {
                this.clouds.push(potentialCloud[0])
                potentialCloud.length = 0 //Clear ready for next iteration
            }
        }
    
        //Generate random positions of trees & prevent overlap with canyons
        for(var i = 0; i < random(8, 15); i++)
        {
            var t = new this.generateTreeObj(random(-10, 2900), random(0.8, 1));
            var potentialTree = []
            potentialTree.push(t);
            for(var j = 0; j < this.canyons.length; j++)
            {
                if((potentialTree[0].x_pos < this.canyons[j].x_pos+this.canyons[j].width) && (potentialTree[0].x_pos > this.canyons[j].x_pos) ||
                    (potentialTree[0].x_pos > this.canyons[j].x_pos+this.canyons[j].width) && (potentialTree[0].x_pos < this.canyons[j].x_pos))
                {
                    i -= 1;
                    potentialTree.length = 0; //Clear tested Tree when test fails
                    break;
                }
            }
            if(potentialTree.length > 0)
            {
                this.trees.push(potentialTree[0])
                potentialTree.length = 0 //Clear ready for next iteration
            }
        }
        
        //Generate random positions of collectables & prevent overlap with canyons
        for(var i = 0; i < 3; i++)
        {
            var col = new this.generateCollectableObj(random(800, 2600), height * 0.75, 100);
            var potentialCollectable = []
            potentialCollectable.push(col);
            for(var j = 0; j < this.canyons.length; j++)
            {
                if((potentialCollectable[0].x_pos < this.canyons[j].x_pos + this.canyons[j].width/2) && 
                    (potentialCollectable[0].x_pos+275*potentialCollectable[0].size/100 > this.canyons[j].x_pos + this.canyons[j].width/2) ||
                    (potentialCollectable[0].x_pos < this.canyons[j].x_pos+this.canyons[j].width) && (potentialCollectable[0].x_pos > this.canyons[j].x_pos) ||
                    (potentialCollectable[0].x_pos > this.canyons[j].x_pos+this.canyons[j].width) && (potentialCollectable[0].x_pos < this.canyons[j].x_pos))
                {
                     i -= 1;
                    potentialCollectable.length = 0; //Clear tested collectable when test fails
                    break;
                }
            }
            //Additional test to make sure chests aren't grouped together
            if((potentialCollectable.length > 0) && this.canyons.length > 0)
            {
                for(var k = 0; k < this.collectables.length; k++)
                {
                    if(abs(potentialCollectable[0].x_pos - this.collectables[k].x_pos) < 400)
                    {
                        i -= 1;
                        potentialCollectable.length = 0; //Clear tested collectable when test fails
                        break;
                    }
                    if(k > 20) //Failsafe in case collectables are placed in such a way that rule cannot be satisfied
                    {
                        this.createNewLevel();
                    }
                }
            }
            if(potentialCollectable.length > 0)
            {
                this.collectables.push(potentialCollectable[0])
                potentialCollectable.length = 0 //Clear ready for next iteration
            }
        }
        
        //Generate random positions of enemies avoiding canyons
        for(var i = 0; i < random(8, 15); i++)
        {
            var enem = new Skeleton(random(width/2 + 210, 2600), height * 0.75, random(0.7, 1.1), random(40, 80), Math.round(random(-1,1)));
            var potentialEnemy = []
            potentialEnemy.push(enem);
            rightRange = potentialEnemy[0].x + potentialEnemy[0].range;
            leftRange = potentialEnemy[0].x - potentialEnemy[0].range;
            for(var j = 0; j < this.canyons.length; j++)
            {
                if(((potentialEnemy[0].x < this.canyons[j].x_pos+this.canyons[j].width) && (potentialEnemy[0].x > this.canyons[j].x)) ||
                    ((potentialEnemy[0].x > this.canyons[j].x_pos+this.canyons[j].width) && (potentialEnemy[0].x < this.canyons[j].x)) ||
                    ((rightRange < this.canyons[j].x_pos+this.canyons[j].width) && (rightRange > this.canyons[j].x)) ||
                    ((leftRange > this.canyons[j].x_pos+this.canyons[j].width) && (leftRange < this.canyons[j].x)) ||
                    (potentialEnemy[0].startingDirection == 0) ||
                    (abs(dist(this.canyons[j].x_pos, height*0.75, potentialEnemy[0].x, height*0.75) <= potentialEnemy[0].range)) ||
                    (abs(dist(this.canyons[j].x_pos+this.canyons[j].width, height*0.75, potentialEnemy[0].x, height*0.75)) <= potentialEnemy[0].range) ||
                    (abs(dist(this.canyons[j].x_pos+this.canyons[j].width/2, height*0.75, potentialEnemy[0].x, height*0.75)) < 10) ||
                    (abs(dist(this.canyons[j].x_pos, height/2, rightRange, height/2)) < 40) ||
                    (abs(dist(this.canyons[j].x_pos+this.canyons[j].width, height/2, leftRange, height/2)) < 40))
                {
                     i -= 1;
                    potentialEnemy.length = 0; //Clear tested enemy when test fails
                    break;
                }
            }
            if(potentialEnemy.length > 0)
            {
                this.enemies.push(potentialEnemy[0])
                potentialEnemy.length = 0 //Clear ready for next iteration
            }
        }
    },
        
    generateCanyonObj: function(x_pos, width)
    {
        this.x_pos = x_pos;
        this.width = width;
    },
    
    generateMountainObj: function(x_pos, y_pos, size)
    {
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.size = size;
    },
    
    generateCloudObj: function(x_pos, y_pos, size)
    {
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.size = size;
    },
        
    generateTreeObj: function(x_pos, size)
    {
        this.x_pos = x_pos;
        this.size = size;
    },
    
    generateCollectableObj: function(x_pos, y_pos, size)
    {
        this.x_pos = x_pos; 
        this.y_pos = y_pos; 
        this.size = size;
        this.isFound = false;
    },

    generateEnemyObj: function(x, y, size, range, startingDirection)
    {
        this.x = x;
        this.y = y;
        this.size = size;
        this.range = range;
        this.startingDirection = startingDirection;
    }
}
    
//Inital setup on game load. Draws background and other essential start-up functions, creats a new level then calls the startGame function.
function setup()
{
    createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    gameChar.lives = 3;
    levelCounter = 1
    
    //Set mountain y_pos - not doing so specifically results in undefined value
    for(var i = 0; i < level.mountains.length; i++)
    {
        level.mountains[i].y_pos = floorPos_y;
    }
    
    //Setcollectable y_pos - not doing so specifically results in undefined value
    for(var i = 0; i < level.collectables.length; i++)
    {
        level.collectables[i].y_pos = floorPos_y;
    }
    
    // Initialise the player's score before playing - only resets on GameOver
    game_score = 0;
    
    level.createNewLevel();
    
    startGame();
}

//Function called at the start of the game, and each time the player dies and the game is reset.
function startGame()
{
    gameChar.x = width/2;
	gameChar.y = floorPos_y;
    
    gravity = 5; //Fall rate from jumping
    plummetRate = 5; //Fall rate from falling in a canyon

	// Variable to control the background scrolling.
	scrollPos = 0;

    gameOverSound_played = false;
    deathSound_played = false;
    victorySound_played = false;
    
	gameChar.world_x = gameChar.x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    isJumping = false;
    
    // Initialise the level-ending flagpole
    flagpole = 
    {
        x_pos: 2750,
        isReached: false,
        flag_ypos: floorPos_y-60,
        raise_speed: 3        
    }
    
    //Positioning and spacing of life tokens in top-left corner
    lifeToken = 
    {
        x_pos: 70,
        y_pos: 50,
        size: 0.4
    }
    
    //Play background music
    backgroundMusic.loop();
}

//Main draw function called on each frame. Calls other draw functions from within the level object
function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(242, 209, 107);
	rect(0, floorPos_y, width, height/4); // draw some sandy ground
    
    push();
    translate(scrollPos,0); // translates background objects to create illusion of movement

	// Draw mountains.
    level.drawMountains();

    // Draw clouds.
    cloudMovement(); //Make clouds move from right to left as though blown by wind
    level.drawClouds();
    
	// Draw trees.
    level.drawTrees();
    
    // Draw canyons.
    level.drawCanyons();
    
    // Draw collectables.
    level.drawCollectables();

    // Checks whether conditions are met for player to fall into a canyon
    for(var i = 0; i < level.canyons.length; i++)
    {
        checkCanyon(level.canyons[i]);
    }
    
    //Display game over when lives lost
    if(gameChar.lives < 1)
    {
        displayGameOverScreen();
        if(gameOverSound_played == false)
        {
            gameOverSound.play(); //Play game over sound
            gameOverSound_played = true;
        }
        if(isJumping) //If spacebar is pressed, reload game (reused isJumping bool from char movement)
        {
            gameChar.lives = 3;
            game_score = 0;
            level.createNewLevel();
            startGame();
        }
        return; //Return to stop char interaction during game over screen
    }
    
    // Check collectables items to see if found
    for(var i = 0; i < level.collectables.length; i++)
    {
        if(!level.collectables[i].isFound)
        {
            checkCollectable(level.collectables[i]); //collision check with collectables
        }
    };
    
    //Check if char runs out of lives
    checkPlayerDie(); 

	//Draw flagpole
    renderFlagpole(flagpole);
    
    //Draw enemies and check collision mechanics
    for(var i = 0; i < level.enemies.length; i++)
    {
        level.enemies[i].draw();
        
        level.enemies[i].checkContact(gameChar.world_x, gameChar.y);
    }
    
    pop(); //coupled with push and translate following ground drawing

    //Check if flagpole has been reached by character
    if(!flagpole.isReached) //Only if not already been reached
    {
        checkFlagpole(flagpole);
    }
    
    //Raise flag to full mast if it has been reached and display level complete text
    if(flagpole.isReached)
    {
        if(flagpole.flag_ypos > 234)
        {
            raiseFlag(flagpole);
        }
        
        if(victorySound_played == false)
        {
            victorySound.play();
            victorySound_played = true;
        }
        backgroundMusic.stop();
        push();
        textSize(80);
        stroke(0);
        strokeWeight(10);
        fill(255,215,0);
        text("Level Complete!", width/2-300, height/2-150);
        
        textSize(60);
        text("Press space to continue..", width/2-350, height/2+200);
        pop();

        if(isJumping) //Restart game (later progress to next level) if spacebar pressed. Reused isJumping bool from char movement
        {
            levelCounter += 1 //Add one to the level counter to show completed levels at end of game
            level.createNewLevel();
            startGame();
        }
        return;
    }
    

    //Show game_score in top left corner
    push();
    fill(255);
    strokeWeight(1);
    stroke(0);
    text("Score: " + game_score, 20, 20);
    pop();
    
    //Draw ship wheels in top left to indicate remaining lives
    drawLifeTokens();    
    
    // Draw game character.
    gameChar.drawGameChar();
    
    // Check for life 1-ups when 3 treasures collected
    gameChar.checkTreasure();
    
	// Logic to make the game character move or the background scroll. 
    //Nb. consider replacing finite values with speed variable to change char speed - perhaps powerups?
    if(isLeft)
	{
		if(gameChar.x > width * 0.2)
		{
			gameChar.x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar.x < width * 0.8)
		{
			gameChar.x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    // Future todo - make upward jump animation smoother.    
    if (isJumping)
    {
        if (gameChar.y == floorPos_y)
        {
            gameChar.y -= 100;
            jumpSound.play(); //Play jumping sound
        }
        
        isJumping = false; //reset variable
    }
    
    //Add gravity
    if (gameChar.y < floorPos_y)
    {
        isFalling = true;
        gameChar.y += gravity;
    }
    else isFalling = false;
        
	// Update real position of gameChar for collision detection.
	gameChar.world_x = gameChar.x - scrollPos;
    
    // Logic to make sure character stays within bounds of canyon whilst plummeting
    if(isPlummeting)
    {
        gameChar.x = constrain(gameChar.world_x, currentCanyonLeftSide+41, currentCanyonRightSide-1)+scrollPos; // NB scrollPos must be added to determine position relative to original frame
        gameChar.y += plummetRate;
    }
}

// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
    if (keyCode == 37)
    {
        isLeft = true;
    }
    else if (keyCode == 39)
    {
        isRight = true;
    }
    
    if (keyCode == 32)
    {
        isJumping = true;
    }
}

function keyReleased()
{
    if (keyCode == 37)
    {
        isLeft = false;
    }
    else if (keyCode == 39)
    {
        isRight = false;
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if (t_canyon.x_pos+40 <= gameChar.world_x && t_canyon.x_pos+t_canyon.width >= gameChar.world_x)
    {
        if  (gameChar.y >= floorPos_y)
        {
            isPlummeting = true;
            gameChar.y += plummetRate;
            currentCanyonLeftSide = t_canyon.x_pos;
            currentCanyonRightSide = t_canyon.x_pos+t_canyon.width; 
        }
    }
}

// Function to respawn after falling down canyon for speedier testing
function characterRespawn()
{
    gameChar.x = width/2;
    gameChar.y = floorPos_y;
    isPlummeting = false;
    scrollPos = 0;
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
    if (dist(gameChar.world_x, gameChar.y, t_collectable.x_pos + (60*t_collectable.size/100)/2, t_collectable.y_pos) < 30)
    {
        t_collectable.isFound = true;
        collectableSound.play();
        game_score += 1;
    }
}

// Function to draw the flagpole
function renderFlagpole(flagpole_obj)
{
    push();
    noStroke();
    fill(170);
    rect(flagpole_obj.x_pos-20, floorPos_y, 40, -10); //Flagpole base pedestal
    
    stroke(170);
    strokeWeight(5);
    line(flagpole_obj.x_pos, floorPos_y -10, flagpole_obj.x_pos, floorPos_y - 200) //Flagpole pole
    
    noStroke();
    fill(0);
    rect(flagpole_obj.x_pos+3, flagpole_obj.flag_ypos, 70, 50) //Flag background
    
    //Skull white
    fill(255);
    noStroke();
    ellipse(flagpole_obj.x_pos+38, flagpole_obj.flag_ypos+15, 20,23);
    rect(flagpole_obj.x_pos+33, flagpole_obj.flag_ypos+20, 10, 10);
    
    //Crossbones white
    stroke(255);
    strokeWeight(3);
    line(flagpole_obj.x_pos+22, flagpole_obj.flag_ypos+30, flagpole_obj.x_pos+52, flagpole_obj.flag_ypos+40);
    line(flagpole_obj.x_pos+22, flagpole_obj.flag_ypos+40, flagpole_obj.x_pos+52, flagpole_obj.flag_ypos+30);
    noStroke();
    ellipse(flagpole_obj.x_pos+20, flagpole_obj.flag_ypos+32, 6, 6); //Top-left bone ends
    ellipse(flagpole_obj.x_pos+22, flagpole_obj.flag_ypos+28, 6, 6);
    
    ellipse(flagpole_obj.x_pos+54, flagpole_obj.flag_ypos+32, 6, 6); //Top-right bone ends
    ellipse(flagpole_obj.x_pos+52, flagpole_obj.flag_ypos+28, 6, 6);
    
    ellipse(flagpole_obj.x_pos+20, flagpole_obj.flag_ypos+39, 6, 6); //Bottom-left bone ends
    ellipse(flagpole_obj.x_pos+22, flagpole_obj.flag_ypos+43, 6, 6);
    
    ellipse(flagpole_obj.x_pos+54, flagpole_obj.flag_ypos+39, 6, 6); //Bottom-right bone ends
    ellipse(flagpole_obj.x_pos+52, flagpole_obj.flag_ypos+43, 6, 6);
    
    //Skull eyes
    noStroke();
    fill(0);
    ellipse(flagpole_obj.x_pos+33, flagpole_obj.flag_ypos+15, 8,8); //Left
    ellipse(flagpole_obj.x_pos+43, flagpole_obj.flag_ypos+15, 8,8); //Right
    
    //Teeth
    noFill();
    stroke(0);
    strokeWeight(0.3);
    for(var i = 0; i < 6; i++)
    {
        for(var j = 0; j < 2; j++)
        {
            rect(flagpole_obj.x_pos+35+i, flagpole_obj.flag_ypos+24+j*2, 1, 2);    
        }
    }
      
    pop();
}

//Check if player has reached the flagpole
function checkFlagpole(flagpole_obj)
{
    if(abs(gameChar.world_x - flagpole_obj.x_pos) < 15)
    {
        flagpole_obj.isReached = true;
    }
}

//Raises the flag to the top of the flagpole when reached by player
function raiseFlag(flagpole_obj)
{
    flagpole_obj.flag_ypos -= flagpole_obj.raise_speed;
}

function checkPlayerDie()
{
    //Play falling sound if character starts falling
    if (gameChar.y > floorPos_y)
    {
        if(deathSound_played == false)
        {
            deathSound.play();
            deathSound_played = true;
        }
    }
    
    //Respawn character, resetting game when falling down canyon
    if (gameChar.y > height+100)
    {
        backgroundMusic.stop();
        gameChar.lives -= 1
        if(gameChar.lives > 0)
        {
            startGame();
        }
    }
}

function drawLifeTokens()
{
    //Draw life tokens
    push();
    stroke(0);
    fill(255);
    strokeWeight(1);
    text("Lives: ", 20, 50);
    for(var i = 0; i < gameChar.lives; i++)
    {
        strokeWeight(3*lifeToken.size)
        stroke(222, 184, 135);
        noFill();
        
        var current_pos = (70 * lifeToken.size) * i

        ellipse(lifeToken.x_pos+current_pos, lifeToken.y_pos, 40*lifeToken.size, 40*lifeToken.size);
        ellipse(lifeToken.x_pos+current_pos, lifeToken.y_pos, 10*lifeToken.size, 10*lifeToken.size);

        line(lifeToken.x_pos-1*lifeToken.size+current_pos, lifeToken.y_pos-30*lifeToken.size, 
             lifeToken.x_pos-1*lifeToken.size+current_pos, lifeToken.y_pos+29*lifeToken.size);
        
        line(lifeToken.x_pos-30*lifeToken.size+current_pos, lifeToken.y_pos-1*lifeToken.size, 
             lifeToken.x_pos+30*lifeToken.size+current_pos, lifeToken.y_pos-1*lifeToken.size);
        
        line(lifeToken.x_pos+19*lifeToken.size+current_pos, lifeToken.y_pos-21*lifeToken.size, 
             lifeToken.x_pos-21*lifeToken.size+current_pos, lifeToken.y_pos+24*lifeToken.size);
        
        line(lifeToken.x_pos-19*lifeToken.size+current_pos, lifeToken.y_pos-21*lifeToken.size, 
             lifeToken.x_pos+21*lifeToken.size+current_pos, lifeToken.y_pos+24*lifeToken.size);
    }
    
    pop();
}

function displayGameOverScreen()
{
    push();
    background(0);
    
    backgroundMusic.stop();
    
    scrollPos = 0 //Resets scroll pos to make sure the scull isn't off-centred
    var scale = 7
    var skullPosition_x = width/2
    var skullPosition_y = height/2-150
        
    // Draw big skull
    fill(255);
    noStroke();
    ellipse(skullPosition_x, skullPosition_y, 20*scale,23*scale);
    rect(skullPosition_x-5*scale, skullPosition_y+5*scale, 10*scale, 10*scale);
    
    //Crossbones white
    stroke(255);
    strokeWeight(3*scale);
    line(skullPosition_x-16*scale, skullPosition_y+15*scale, 
         skullPosition_x+14*scale, skullPosition_y+25*scale);
    
    line(skullPosition_x-16*scale, skullPosition_y+25*scale, 
         skullPosition_x+14*scale, skullPosition_y+15*scale);
    
    noStroke();
    ellipse(skullPosition_x-18*scale, skullPosition_y+17*scale, 6*scale, 6*scale); //Top-left bone ends
    ellipse(skullPosition_x-16*scale, skullPosition_y+13*scale, 6*scale, 6*scale);
    
    ellipse(skullPosition_x+16*scale, skullPosition_y+17*scale, 6*scale, 6*scale); //Top-right bone ends
    ellipse(skullPosition_x+14*scale, skullPosition_y+13*scale, 6*scale, 6*scale);
    
    ellipse(skullPosition_x-18*scale, skullPosition_y+24*scale, 6*scale, 6*scale); //Bottom-left bone ends
    ellipse(skullPosition_x-16*scale, skullPosition_y+28*scale, 6*scale, 6*scale);
    
    ellipse(skullPosition_x+16*scale, skullPosition_y+24*scale, 6*scale, 6*scale); //Bottom-right bone ends
    ellipse(skullPosition_x+14*scale, skullPosition_y+28*scale, 6*scale, 6*scale);
    
    //Skull eyes
    noStroke();
    fill(0);
    ellipse(skullPosition_x-5*scale, skullPosition_y, 8*scale,8*scale); //Left
    ellipse(skullPosition_x+5*scale, skullPosition_y, 8*scale,8*scale); //Right
    
    //Teeth
    noFill();
    stroke(0);
    strokeWeight(0.3*scale);
    for(var i = 0; i < 6; i++)
    {
        for(var j = 0; j < 2; j++)
        {
            rect(skullPosition_x-3*scale+i*scale, skullPosition_y+9*scale+j*2*scale, 1*scale, 2*scale);    
        }
    }
    
    //Game Over Text
    textSize(80);
    stroke(255);
    fill(255);
    text("Game Over!", skullPosition_x-210, height-130);
    
    textSize(25);
    text("Treasure score: " + game_score, skullPosition_x-450, height-300)
    text("Highest level reached: " + levelCounter, skullPosition_x+200, height-300)
    
    textSize(35);
    text("Press space to continue..", skullPosition_x-190, height-70);
    
    pop();
}

//Clouds move across screen at random speeds
function cloudMovement()
{
    for(var i = 0; i < level.clouds.length; i++)
    {
        level.clouds[i].x_pos += random(-0.05,-0.5);
    }
}