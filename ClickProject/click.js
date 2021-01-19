import { OrbitControls } from './import/OrbitControls.js';
    // Set our main variables
    let scene,  
        renderer,
        camera,
        model,                              // Our character
        neck,                               // Reference to the neck bone in the skeleton
        waist,                               // Reference to the waist bone in the skeleton
        arm,
        arm2,
        possibleAnims,                      // Animations found in our file
        mixer,                              // THREE.js animations mixer
        idle,
        cube,                               // Idle, the default state our character returns to
        clock = new THREE.Clock(),          // Used for anims, which run to a clock instead of frame rate 
        currentlyAnimating = false,         // Used to check whether characters neck is being used in another anim
        raycaster = new THREE.Raycaster(),  // Used to detect the click on our character
        loaderAnim = document.getElementById('js-loader');

    const mouse = new THREE.Vector2();
    const target = new THREE.Vector2();
    const canvas = document.querySelector('#c');
    const backgroundColor = 0xf1f1f1; //0xf1f1f1;

    

    let createCube = function(){
        let geometry = new THREE.BoxGeometry(1,1,1);
        let material = new THREE.MeshBasicMaterial({color:0x0f00ff,wireframe:true});
        cube = new THREE.Mesh(geometry, material);
        cube.rotation.x = -0.2;
        cube.rotation.y = -0.1;
        cube.rotation.z = -0.3;
        scene.add(cube);
    };

    

    let init = function() {
        

        // Init the scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(backgroundColor);
        scene.fog = new THREE.Fog(backgroundColor, 60, 100);

        // Init the renderer
        
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

                // Add a camera
        camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 15 
        camera.position.x = 0;
        camera.position.y = -3;

        const controls = new OrbitControls( camera, renderer.domElement );
        //controls.target.set( 0, 100, 0 );
        //controls.update();

        //const MODEL_PATH = './toffyfanglb.glb';
        const MODEL_PATH = './StacyDance.glb';
        let stacy_txt = new THREE.TextureLoader().load('./stacy003-itri.jpg');

        stacy_txt.flipY = false; // we flip the texture so that its the right way up

        const stacy_mtl = new THREE.MeshPhongMaterial({
        map: stacy_txt,
        color: 0xffffff,
        skinning: true
        });


        var loader = new THREE.GLTFLoader();

        loader.load(MODEL_PATH,function(gltf) {
                // A lot is going to happen here
                model = gltf.scene;
                let fileAnimations = gltf.animations;

                model.traverse(o => {
                    if (o.isMesh) {
                    o.castShadow = true;
                    o.receiveShadow = true;
                    o.material = stacy_mtl; // Add this line
                    };
                    
                    //if (o.isBone) {
                    //    console.log(o.name);
                    //};

                    // Reference the neck and waist bones
                    
                    let idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'idle');
                    //console.log(idleAnim);
                    if (o.isBone && o.name === 'mixamorigNeck') { 
                        neck = o;
                        //console.log(idleAnim);
                        //console.log(o);
                    };

                    if(o.isBone && o.name === 'mixamorigRightArm'){
                        // console.log(idleAnim);
                        arm = o;
                    };
                    if(o.isBone && o.name === 'mixamorigLeftArm'){
                        // console.log(idleAnim);
                        arm2 = o;
                    };
                    if (o.isBone && o.name === 'mixamorigSpine') {
                        waist = o;
                        //console.log(idleAnim.tracks);
                    };
                    
                    idleAnim.tracks.splice(3, 3);
                    idleAnim.tracks.splice(15, 57);
                    //idleAnim.tracks.splice(3, 3);
                    //idleAnim.tracks.splice(9, 3);
                });
                let modelSize = 5;
                model.scale.set(modelSize, modelSize, modelSize);
                model.position.y = -8.5;
                //model.rotation.y = -0.51;
                //model.rotation.x = 0.21;
                //model.position.z = -10;

                scene.add(model);

                loaderAnim.remove();

                mixer = new THREE.AnimationMixer(model);
                let idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'idle');
                idle = mixer.clipAction(idleAnim);
                idle.play();
            },
            undefined, // We don't need this function
            function(error) {
                console.error(error);
            }
        );
        




        // Add lights
        let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.31);
        hemiLight.position.set(0, 50, 0);
        

        let d = 8.25;
        let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
        dirLight.position.set(-8, 12, 8);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 1500;
        dirLight.shadow.camera.left = d * -1;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = d * -1;

        // Add hemisphere light to scene
        scene.add(hemiLight);
        // Add directional Light to scene
        scene.add(dirLight);

        // give you a sun
        let geometry = new THREE.SphereGeometry(2, 32, 32);
        let material = new THREE.MeshPhongMaterial({ color: 0xfff143 ,emissive :0xfff143	 }); // 0xf2ce2e 
        let sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(-9, 12, 8);
        scene.add(sphere);
        
        
        createCube();

        // Floor
        let floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
        let floorMaterial = new THREE.MeshPhongMaterial({
            color: 0xeeeeee,
            //color: 0xff0000,
            shininess: 0,
        });

        let floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -0.5 * Math.PI; // This is 90 degrees by the way
        floor.receiveShadow = true;
        floor.position.y = -8.5; // 地板深度
        scene.add(floor);

        //document.addEventListener( 'wheel', onMouseWheel, false );
        window.addEventListener( 'resize', onWindowResize, false );
        //window.addEventListener( "click", onMouseMove, false );
        //window.addEventListener( 'resize', onWindowResize, false );
        //window.addEventListener( "click", onDocumentMouseMove, false );
        document.addEventListener('mousemove', function(e) {
            var mousecoords = getMousePos(e);
            if (neck && waist) {
                moveJoint(mousecoords, neck, 80);
                moveJoint(mousecoords, waist, 30);
            };
            if (arm && arm2 && waist){
                moveJoint(mousecoords, waist, 50);
                moveJoint(mousecoords, arm, 30);
                moveJoint(mousecoords, arm2, 30);
            };
        });
          
          
    }

    function getMousePos(e) {
        return { x: e.clientX, y: e.clientY };
    };

    function moveJoint(mouse, joint, degreeLimit) {
        let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
        joint.rotation.y = THREE.Math.degToRad(degrees.x);
        joint.rotation.x = THREE.Math.degToRad(degrees.y);
    };

    function getMouseDegrees(x, y, degreeLimit) {
        let dx = 0,
            dy = 0,
            xdiff,
            xPercentage,
            ydiff,
            yPercentage;
      
        let w = { x: window.innerWidth, y: window.innerHeight };
      
        // Left (Rotates neck left between 0 and -degreeLimit)
        
         // 1. If cursor is in the left half of screen
        if (x <= w.x / 2) {
          // 2. Get the difference between middle of screen and cursor position
          xdiff = w.x / 2 - x;  
          // 3. Find the percentage of that difference (percentage toward edge of screen)
          xPercentage = (xdiff / (w.x / 2)) * 100;
          // 4. Convert that to a percentage of the maximum rotation we allow for the neck
          dx = ((degreeLimit * xPercentage) / 100) * -1; }
      // Right (Rotates neck right between 0 and degreeLimit)
        if (x >= w.x / 2) {
          xdiff = x - w.x / 2;
          xPercentage = (xdiff / (w.x / 2)) * 100;
          dx = (degreeLimit * xPercentage) / 100;
        }
        // Up (Rotates neck up between 0 and -degreeLimit)
        if (y <= w.y / 2) {
          ydiff = w.y / 2 - y;
          yPercentage = (ydiff / (w.y / 2)) * 100;
          // Note that I cut degreeLimit in half when she looks up
          dy = (((degreeLimit * 0.5) * yPercentage) / 100) * -1;
          }
        
        // Down (Rotates neck down between 0 and degreeLimit)
        if (y >= w.y / 2) {
          ydiff = y - w.y / 2;
          yPercentage = (ydiff / (w.y / 2)) * 100;
          dy = (degreeLimit * yPercentage) / 100;
        }
        return { x: dx, y: dy };
    };


    let resizeRendererToDisplaySize = function (renderer) {
        const canvas = renderer.domElement;
        let width = window.innerWidth;
        let height = window.innerHeight;
        let canvasPixelWidth = canvas.width / window.devicePixelRatio;
        let canvasPixelHeight = canvas.height / window.devicePixelRatio;
      
        const needResize =
          canvasPixelWidth !== width || canvasPixelHeight !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
    };

    let mainLoop = function(){

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        if (mixer) {
            mixer.update(clock.getDelta());
        };

        cube.rotation.x -= 0.05;
        cube.rotation.y -= 0.01;
        cube.rotation.z -= 0.03;
        renderer.render(scene, camera);
        requestAnimationFrame(mainLoop);
    };



    function onWindowResize() {

        console.log('kkk resize original');
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

 

    init(); 
    mainLoop();

