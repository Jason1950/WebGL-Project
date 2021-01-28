    let scene,  
        renderer,
        camera,
        controls;

    let group = [];
    let rotaSpeed = 0.01;

    // let canvas = document.querySelector('#canvas001');

    import { OrbitControls } from './import/OrbitControls.js';

    function init() {
        // Init the scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x00ff01);   // scene.fog = new THREE.Fog(backgroundColor, 60, 100);
        // scene.background = new THREE.Color( 0x0 );
        // Init the renderer
        renderer = new THREE.WebGLRenderer({  antialias: true });
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild(renderer.domElement);

        // add a group for push something
        group = new THREE.Group();
        scene.add( group );

        let cube = new THREE.Mesh(new THREE.BoxGeometry(4,4,4), new THREE.MeshBasicMaterial({color:'#69f',wireframe:false}));
        cube.position.set( 2, 8, 3 );
        //cube.scale.set( 1, 1, 0.6);
        group.add( cube );

        // Add a camera
        camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 15; 
        camera.position.x = 0; 
        camera.position.y = -3;

        camera.lookAt( scene.position );

        controls = new OrbitControls( camera, renderer.domElement );
        controls.enableRotate = false;
        
        window.addEventListener( "resize", onWindowResize, false );
        window.addEventListener( "keydown", onDocumentKeyDown, false );
        document.addEventListener("mousewheel", onMouseWheelScrollFunc, false);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function mainloop() {
        //group.rotateY -= 10;
        //group.rotation.x -= 0.01;
        // let rotaSpeed = 0.01
        // group.rotation.y -= rotaSpeed;

        
        group.rotation.z -= rotaSpeed;
        renderer.render( scene, camera );
        requestAnimationFrame( mainloop );
    }

    function listenFunction(){
        document.addEventListener("mousewheel", onMouseWheelScrollFunc, false);
        window.addEventListener( "keydown", onDocumentKeyDown, false );
    }

    // init();
    // mainloop();

    listenFunction();







    // -----------------------------------------------------
    //
    //
    //            main code is here !!!!!!!!!
    //
    // -----------------------------------------------------





    let r = 100,
        colorVal = 2;

    let A = 0,
        limitA = 0.02;


    function onDocumentKeyDown(event){
        if(event.keyCode === 68){
            // key 68 -> d
            console.log('before group array size : ', group.children.length);
            var keepNumber = 6;
            
            console.log(group);
            console.log(group.getObjectById(5));
            //group.clear();
            for(var i=6;i<group.children.length+1;i++){
                console.log('remove i : ',i)
                group.remove(group.children[i]);
            }
            console.log('after group array size : ', group.children.length);
        }
        if(event.keyCode === 90){
            // key 90 -> Z
            rotaSpeed += 0.01;
            // group.children[5].material.color.set((Math.random()*0xffffff));
            
        }
        if(event.keyCode === 88){
            // key 88 -> x
            rotaSpeed -= 0.01;
        }
        if(event.keyCode === 67){
            // key 67 -> C
            // scene.background = new THREE.Color( Math.random()*0x00ff01);
            r += colorVal;
            scene.background = new THREE.Color( "rgb("+r+",150,200)");
        }
        if(event.keyCode === 82){
            // key 82 -> r
            // scene.background = new THREE.Color( Math.random()*0x00ff01);
            // r += colorVal;

            A += limitA;
            if( A>=1 ){
                limitA *= -1;
                A += limitA;
            }else if( A<= 0 ){
                limitA *= -1;
                A += limitA;
            }
            generateTextureRKey(A);
            // generateTexture();
            // scene.background = (new THREE.Color()).setHSL( 12 + 0.2, 1, 0.5);
        }
        
        //eventTarget.addEventListener("keydown", event => {
        //    if (event.isComposing || event.keyCode === 68) {
        //        return;
        //    }
        //    // do something
        //    });
    }

    function onMouseWheelScrollFunc(event){
        // console.log(event.deltaX,event.deltaY,event);
        if(event.deltaY < 0) {
            console.log('滾輪向上滾動!!');
            if( A<1 ){
                //limitA *= -1;
                A += limitA;
            }
            if(A>=1){
                A -= 0.02;
            }
        }else{
            console.log('滾輪向下滾動!!');
            if( A> 0 ){
                // limitA *= -1;
                A -= limitA;
            }
            if(A<=0){
                A += 0.02;
            }
        }

        // A += limitA;
        // if( A>=1 ){
        //     limitA *= -1;
        //     A += limitA;
        // }else if( A<= 0 ){
        //     limitA *= -1;
        //     A += limitA;
        // }
        generateTextureRKey(A);
    }


    

    function generateTextureRKey(A) { 

        var size = 512; 
        
        // create canvas 
        let canvas = document.getElementById('canvas001'); 
        canvas.width = size; 
        canvas.height = size; 
        
        // get context 
        // var context = scene.getContext('2d'); 
        var context = canvas.getContext('2d'); 
        
        // draw gradient 
        context.rect(0, 0, size, size); 
        var gradient = context.createLinearGradient(0, 0, size, size); 
        // gradient.addColorStop(0, '#99ddff'); // light blue 
        r = Math.random()*256;
        let g = Math.random()*256;
        let b = Math.random()*256;
        // gradient.addColorStop(A, 'rgba(255, 255, 255, 0.0)');
        let B = 0
        if(A>0.5){
            B = 0;
        }else{
            B = 1;
        }
        gradient.addColorStop(A, 'rgb(235, 235, 235)');
        // gradient.addColorStop(0.3, "rgb("+r+","+g+","+b+")");
        gradient.addColorStop(0.5, "#99dd00");
        gradient.addColorStop(B, "red", 'transparent');
        // gradient.addColorStop(A, "rgb("+r+",150,200)"); // light blue 
        // // "rgb("+r+",150,200)"
        // gradient.addColorStop(1, 'transparent'); 

        context.fillStyle = gradient; 
        context.fill(); 
        
        return canvas; 
    }













    function generateTexture() { 

        var size = 512; 
        
        // create canvas 
        let canvas = document.getElementById('canvas001'); 
        canvas.width = size; 
        canvas.height = size; 
        
        // get context 
        var context = canvas.getContext('2d'); 
        
        // draw gradient 
        context.rect(0, 0, size, size); 
        var gradient = context.createLinearGradient(0, 0, size, size); 
        // gradient.addColorStop(0, '#99ddff'); // light blue 
        gradient.addColorStop(0.5, "rgb("+r+",150,200)"); // light blue 
        // "rgb("+r+",150,200)"
        gradient.addColorStop(1, 'transparent'); 
        context.fillStyle = gradient; 
        context.fill(); 
        
        return canvas; 
    }