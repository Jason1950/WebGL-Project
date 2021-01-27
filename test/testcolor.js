    let scene,  
        renderer,
        camera;

    let group = [];

    import { OrbitControls } from './import/OrbitControls.js';

    function init() {
        // Init the scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(backgroundColor);   // scene.fog = new THREE.Fog(backgroundColor, 60, 100);

        // Init the renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild(renderer.domElement);

        // add a group for push something
        group = new THREE.Group();
        scene.add( group );

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
        controls.enableRotate = true;
        
        window.addEventListener( "resize", onWindowResize, false );
        window.addEventListener( "keydown", onDocumentKeyDown, false );
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function mainloop() {
        //group.rotateY -= 10;
        //group.rotation.x -= 0.01;
        group.rotation.y -= rotaSpeed;
        group.rotation.z -= rotaSpeed;
        renderer.render( scene, camera );
        requestAnimationFrame( mainloop );
    }

    init();
    mainloop();