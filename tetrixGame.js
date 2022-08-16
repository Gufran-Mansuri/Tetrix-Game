///Mohamed Gufran Sarfaraz Mansuri, november 17,2021 
/**
 * i made a tetrix game from vanilla javascript
 */
window.addEventListener("load", function(){
    let grid = document.querySelector(".gameGrid")
    let gridSquare = Array.from(document.querySelectorAll(".gameGrid div"))
    let score = document.querySelector("#score")
    let startBtn = document.querySelector("#start")
    let width = 10
    let nextRandom = 0
    let timer 
    let scores = 0
    const color = [
        "orange",
        "purple",
        "green",
        "yellow",
        "blue"
    ]
    let nn = document.getElementById("name")
    nn.innerHTML=this.localStorage.getItem("name") + "  Score:" ;
    

    grid.style.backgroundColor = this.localStorage.getItem("color")
    let mini = document.querySelector(".miniGrid")
    mini.style.backgroundColor = this.localStorage.getItem("color")
    // making tetraminoes
    let ltetraminoes = [
        [1,width+1,width*2+1,2],
        [width,width+1,width+2,width*2+2],
        [1,width+1,width*2+1,width*2+2],
        [width,width*2,width*2+1,width*2+2]
    ]
    let ztetraminoes = [
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1],
    ]
    let tTetraminoes = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]
    let oTetraminoes = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]
    let iTetraminoes = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    let tetraminoes = [ltetraminoes,ztetraminoes,tTetraminoes,oTetraminoes,iTetraminoes]
    let currentPosition = Math.floor(Math.random()*8)
    
    
    
    let randon  = Math.floor(Math.random()*5) 
    let currentRotation = 0
    let current = tetraminoes[randon][currentRotation]

    // drawing tetraminoes
    function draw(){
        
        current.forEach(function(index){
            gridSquare[currentPosition + index ].classList.add("tetrominoes");
            gridSquare[currentPosition + index].style.backgroundColor = color[randon]
        })
        
    }
    // undrawing tetraminoes
    function undraw(){
        current.forEach(function(index){
            gridSquare[currentPosition + index ].classList.remove("tetrominoes");
            gridSquare[currentPosition + index].style.backgroundColor = ""
        })
    }

    
    // event function for controlling the tertraminoes 
    function controls(event){
        if("ArrowLeft" === event.key || "a" === event.key ){
            left()
        }else if ("ArrowDown" === event.key || "s" === event.key){
            movedown()
        }else if ("ArrowUp" === event.key || "w" === event.key){
            rotate()
        }else if ("ArrowRight" === event.key || "d" === event.key){
            right()
        }
    }
    window.addEventListener("keydown", controls)
    
    // function to move down
    function movedown(){
        undraw()
        currentPosition = currentPosition + width
        draw()
        freeze()
    }

    //fuction to freeze the tetraminoes when it touches the bottom or another tetraminoes
    function freeze(){
        if(current.some(index => gridSquare[currentPosition + index + width].classList.contains("fix")))
        {
            current.forEach(index => gridSquare[currentPosition + index ].classList.add("fix"))
            randon = nextRandom
            nextRandom = Math.floor(Math.random()*5)
            current = tetraminoes[randon][currentRotation]
            currentPosition = Math.floor(Math.random()*8)
            draw()
            displayShape()  
            addScore()
            gameOver()
        }
    }

    
    // moves the tetraminoes left
    function left(){
        undraw()
        let check = current.some(index => (currentPosition + index ) % width === 0)
        
        if(!check) { 
            currentPosition = currentPosition - 1
        }
        
        if(current.some(index => gridSquare[currentPosition + index].classList.contains("fix"))){
            currentPosition = currentPosition + 1
        }
        draw()
    }
    // moves the tetraminoes right
    function right(){
        undraw()
        let check = current.some(index => (currentPosition + index ) % width === width - 1)
        
        if(!check) { 
            currentPosition = currentPosition + 1
        }
        
        if(current.some(index => gridSquare[currentPosition + index].classList.contains("fix"))){
            currentPosition = currentPosition - 1
        }
        draw()
    }
    // rotates the tetraminoes 
    function rotate(){
        undraw()
        currentRotation++
        if(currentRotation === current.length){
            currentRotation = 0
        }
        current = tetraminoes[randon][currentRotation]
        draw()
    }

    //show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.miniGrid div')
    const displayWidth = 4
    const displayIndex = 0


    //the Tetrominos without rotations
    let upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]

    //display the shape in the mini-grid display
    function displayShape() {
        //remove any trace of a tetromino form the entire grid
        displaySquares.forEach(square => {
        square.classList.remove("tetrominoes")
        square.style.backgroundColor = ""
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add("tetrominoes")
            displaySquares[displayIndex + index].style.backgroundColor = color[randon]
        })
    }


    // event listener for the start and stop button 
    startBtn.addEventListener("click",()=>{
        if(timer){
            clearInterval(timer)
            timer = null
        }else{
            draw()
            timer = setInterval(movedown,1000)
            nextRandom = Math.floor(Math.random()*5)
            displayShape()
        } 
    })

    // function to increase the score as well as removing the row filledwith tetraminoes
    function addScore(){
        for(let i = 0 ; i < 199 ; i += width){
            const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]
            if(row.every(index => gridSquare[index].classList.contains("fix"))){
                scores = scores + 10
                
                score.innerHTML = scores
                row.forEach(index => {
                    gridSquare[index].classList.remove("fix")
                    gridSquare[index].classList.remove("tetrominoes")
                    gridSquare[index].style.backgroundColor = ""
                })
                let removed = gridSquare.splice(i,width)
                gridSquare = removed.concat(gridSquare)
                gridSquare.forEach(box => {
                grid.appendChild(box)
                })
            }
        }
    }

    // to stop the game when i the tetraminoes touches the top bar
    function gameOver(){
        if(current.some(index => gridSquare[currentPosition + index].classList.contains("fix"))){
            score.innerHTML = "SORRY Game is over"
            clearInterval(timer)
        }
    }



    /// making of the help button
    const openModalButtons = document.querySelectorAll('[data-modal-target]')
    const closeModalButtons = document.querySelectorAll('[data-close-button]')
    const overlay = document.getElementById('overlay')

    openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
    })

    overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
        closeModal(modal)
    })
    })

    closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal')
        closeModal(modal)
    })
    })

    function openModal(modal) {
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
    }

    function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
    }
});