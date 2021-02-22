
    
    var cameraFar = 15 ;
    var theModel;

    let renderer,
        scene,
        camera,
        loader,
        controls,
        TRAY;

    let wallList = new THREE.Group();;

    let activeOption = 'legs' ;
    const MODEL_PATH =  "./chair.glb";

    let camPosition = [0,0,0];
    
    import { OrbitControls } from './OrbitControls.js';
    
    TRAY = document.getElementById('js-tray-slide');
    const colors = [
        {
            texture: './wood_.jpg',
            size: [2,2,2],
            shininess: 60
        },
        {
            texture: './denim_.jpg',
            size: [3, 3, 3],
            shininess: 15
        },
        {
            color: '66533C'
        },
        {
            color: '173A2F'
        },
        {
            color: '153944'
        },
        {
            color: '27548D'
        },
        {
            color: '438AAC'
        }  
    ]

    function init(){
        const canvas = document.querySelector('#c');
        // Init render
        renderer = new THREE.WebGLRenderer({canvas,antialias:true });
        renderer.setClearColor( 0x889988 );
        // renderer.setClearColor( 0x8ffff8 );
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio); 

        document.body.appendChild(renderer.domElement);

        

        // Add a camera
        camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = cameraFar;
        camera.position.x = 0;
        camera.position.set(0.5,5,cameraFar);
        // 0.5 , 5 , 8.8
        const BACKGROUND_COLOR = 0xf1f1f1;

        // Init the scene
        scene = new THREE.Scene();

        // Set background
        scene.background = new THREE.Color(BACKGROUND_COLOR );
        scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);


        // // ambient
        // scene.add( new THREE.AmbientLight( 0x444444 ) );
        // // light
        // let light = new THREE.PointLight( 0xffffff, 0.8 );
        // camera.add( light );

        // Initial material
        const INITIAL_MTL = new THREE.MeshPhongMaterial( { color: 0xf1f1f1, shininess: 10 } );
        const INITIAL_MAP = [
            {childID: "back", mtl: INITIAL_MTL},
            {childID: "base", mtl: INITIAL_MTL},
            {childID: "cushions", mtl: INITIAL_MTL},
            {childID: "legs", mtl: INITIAL_MTL},
            {childID: "supports", mtl: INITIAL_MTL},
        ];
        
        // Init the object loader
        let loader = new THREE.GLTFLoader();

        loader.load(MODEL_PATH, function(gltf) {
            theModel = gltf.scene;

            theModel.traverse((o) => {
                if (o.isMesh) {
                    o.castShadow = true;
                    o.receiveShadow = true;
                    //console.log(o); 
                    //o.name = legs, cushions, back, base, supports;
                }
            });

             // Set initial textures
            for (let object of INITIAL_MAP) {
                initColor(theModel, object.childID, object.mtl);
            }

            // Set the models initial scale   
            theModel.scale.set(2,2,2);

            theModel.rotation.y = Math.PI*9/10;

            // theModel.rotation.x = Math.PI*1/15;

            // Offset the y position a bit
            theModel.position.y = -1;

            
            let cushionsInit = new THREE.TextureLoader().load('./denim_.jpg');
            cushionsInit.repeat.set(3,3,3);
            cushionsInit.wrapS = cushionsInit.wrapT = THREE.RepeatWrapping;
            setMaterial(theModel, 'cushions', new THREE.MeshPhongMaterial({map: cushionsInit, shininess: 10 }));
            
            // Add the model to the scene
            setMaterial(theModel, 'back', new THREE.MeshPhongMaterial({color: 0x66533C, shininess: 10 }));
            setMaterial(theModel, 'legs', new THREE.MeshPhongMaterial({color: 0x66533C, shininess: 10 }));
            setMaterial(theModel, 'base', new THREE.MeshPhongMaterial({color: 0x66533C, shininess: 10 }));
            setMaterial(theModel, 'supports', new THREE.MeshPhongMaterial({color: 0x66533C, shininess: 10 }));
            console.log('load sucessed!')
            scene.add(theModel);

            }, undefined, function(error) {
                console.error(error)
            }
        );

        // Add lights
        var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.61 );
        hemiLight.position.set( 0, 50, 0 );
        // Add hemisphere light to scene   
        scene.add( hemiLight );

        var dirLight = new THREE.DirectionalLight( 0xffffff, 0.54 );
        dirLight.position.set( -8, 12, 8 );
        dirLight.castShadow = true;
        dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
        // Add directional Light to scene    
        scene.add( dirLight );

        // Old Floor
        // let floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
        // let floorMaterial = new THREE.MeshPhongMaterial({color: 0xeeeeee,shininess: 10});
        // let floor = new THREE.Mesh(floorGeometry, floorMaterial);
        // scene.add(floor);
        

        // geometry & floor picture material
        let geometryFloor = new THREE.BoxGeometry( 10.50, 10.50, 0.25 );
        let materialFloor = new THREE.MeshPhongMaterial( {color: 0xFFE4CA} );
        let floorTexture = new THREE.TextureLoader().load( './denim_.jpg' );
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(20, 20);
        let floorMaterialTexture = new THREE.MeshPhongMaterial({map:floorTexture,shininess:0});

        // mesh - floor
        let floorMesh = new THREE.Mesh( geometryFloor, floorMaterialTexture );
        floorMesh.receiveShadow = true;
        floorMesh.position.set( 0, -1, 0 );
        floorMesh.rotation.set( - Math.PI / 2, 0, 0 );
        scene.add( floorMesh );


        // wall mesh start
        let wallBoost = 1.62;

        // geometry & material
        let wallGeometry = new THREE.BoxGeometry( 10.5, 5, 0.25 );
        let wallMaterial = new THREE.MeshLambertMaterial( {color: 0xF0F0F0} );


        let paperTexture1 = new THREE.TextureLoader().load( './wallpaper01.jpg' );
        paperTexture1.wrapS = paperTexture1.wrapT = THREE.RepeatWrapping;
        paperTexture1.repeat.set(2, 2);
        let wallMaterial01 = new THREE.MeshPhongMaterial({map:paperTexture1});

        let paperTexture2 = new THREE.TextureLoader().load( './wallpaper02.jpg' );
        paperTexture2.wrapS = paperTexture2.wrapT = THREE.RepeatWrapping;
        paperTexture2.repeat.set(2, 2);
        let wallMaterial02 = new THREE.MeshPhongMaterial({map:paperTexture2});

        let paperTexture3 = new THREE.TextureLoader().load( './wallpaper03.jpg' );
        paperTexture3.wrapS = paperTexture3.wrapT = THREE.RepeatWrapping;
        paperTexture3.repeat.set(2, 2);
        let wallMaterial03 = new THREE.MeshPhongMaterial({map:paperTexture3});

        let paperTexture4 = new THREE.TextureLoader().load( './wallpaper04.jpg' );
        paperTexture4.wrapS = paperTexture4.wrapT = THREE.RepeatWrapping;
        paperTexture4.repeat.set(5, 5);
        let wallMaterial04 = new THREE.MeshPhongMaterial({map:paperTexture4});

        let logoTexture1 = new THREE.TextureLoader().load( './itrilogo.jpg' );
        logoTexture1.wrapS = logoTexture1.wrapT = THREE.RepeatWrapping;
        // paperTexture4.repeat.set(5, 5);
        let logoMaterial01 = new THREE.MeshPhongMaterial({map:logoTexture1});

        let wallMesh01 = new THREE.Mesh( wallGeometry, wallMaterial01 );
        wallMesh01.position.set( 0, wallBoost, 5.13 );
        wallMesh01.rotation.set( 0, 0, 0 );
        wallMesh01.userData.normal = new THREE.Vector3( 0, 0, - 1 );
        wallMesh01.onBeforeRender = beforeRenderCB();
        wallMesh01.onAfterRender = afterRenderCB();
        scene.add( wallMesh01 );

        let wallMesh02 = new THREE.Mesh( wallGeometry, wallMaterial02 );
        wallMesh02.position.set( 0, wallBoost, - 5.13 );
        wallMesh02.rotation.set( 0, 0, 0 );
        wallMesh02.userData.normal = new THREE.Vector3( 0, 0, 1 );
        wallMesh02.onBeforeRender = beforeRenderCB();
        wallMesh02.onAfterRender = afterRenderCB();
        scene.add( wallMesh02 );
        
        let logoGeometry = new THREE.BoxGeometry( 3, 2, 0.25 );
        // let wallMaterial = new THREE.MeshLambertMaterial( {color: 0xF0F0F0} );
        let logoMesh01 = new THREE.Mesh( logoGeometry, logoMaterial01 );
        logoMesh01.position.set( 0, wallBoost+1, - 5.1295 );
        logoMesh01.rotation.set( 0, 0, 0 );
        logoMesh01.userData.normal = new THREE.Vector3( 0, 0, 1 );
        logoMesh01.onBeforeRender = beforeRenderCB();
        logoMesh01.onAfterRender = afterRenderCB();
        scene.add( logoMesh01 );


        let wallMesh03 = new THREE.Mesh( wallGeometry, wallMaterial03 );
        wallMesh03.position.set( 5.13, wallBoost, 0 );
        wallMesh03.rotation.set( 0, - Math.PI/2, 0 );
        wallMesh03.userData.normal = new THREE.Vector3( - 1, 0, 0 );
        wallMesh03.onBeforeRender =  beforeRenderCB();
        wallMesh03.onAfterRender = afterRenderCB();
        scene.add( wallMesh03 );

        let wallMesh04 = new THREE.Mesh( wallGeometry, wallMaterial04 );
        wallMesh04.position.set( - 5.13, wallBoost, 0 );
        wallMesh04.rotation.set( 0, Math.PI / 2, 0 );
        wallMesh04.userData.normal = new THREE.Vector3( 1, 0, 0 );
        wallMesh04.onBeforeRender = beforeRenderCB();
        wallMesh04.onAfterRender = afterRenderCB();
        scene.add( wallMesh04 );


        //face picture
        var tempGeometry = new THREE.BoxGeometry( 1.3, 1.6, 0.25 );
        var tempTexture = new THREE.TextureLoader().load( './woman01.jpg' );
        tempTexture.wrapS = tempTexture.wrapT = THREE.RepeatWrapping;
        var tempMaterial = new THREE.MeshPhongMaterial({map:tempTexture});
        const colorNumber = 0xEAC100;
        const materialsswoman01 = [
            new THREE.MeshBasicMaterial({color: colorNumber}),new THREE.MeshBasicMaterial({color: colorNumber}),new THREE.MeshBasicMaterial({color: colorNumber}),
            new THREE.MeshBasicMaterial({color: colorNumber}),
            new THREE.MeshBasicMaterial({map: tempTexture}),
            new THREE.MeshBasicMaterial({color: colorNumber})
          ];
        var tempFace = new THREE.Mesh( tempGeometry, materialsswoman01 );
        tempFace.position.set( - 5.05, wallBoost+1, 0 );
        tempFace.rotation.set( 0, Math.PI / 2, 0 );
        tempFace.userData.normal = new THREE.Vector3( 1, 0, 0 );
        tempFace.onBeforeRender = beforeRenderCB();
        tempFace.onAfterRender = afterRenderCB();
        scene.add( tempFace );
        
        var tempGeometry = new THREE.BoxGeometry( 2, 2.2, 0.25 );
        var tempTexture = new THREE.TextureLoader().load( './woman02.jpg' );
        tempTexture.wrapS = tempTexture.wrapT = THREE.RepeatWrapping;
        var tempMaterial = new THREE.MeshPhongMaterial({map:tempTexture});
        const materialsswoman02 = [
            new THREE.MeshBasicMaterial({color: 0x5B4B00}),new THREE.MeshBasicMaterial({color: 0x5B4B00}),new THREE.MeshBasicMaterial({color: 0x5B4B00}),
            new THREE.MeshBasicMaterial({color: 0x5B4B00}),
            new THREE.MeshBasicMaterial({map: tempTexture}),
            new THREE.MeshBasicMaterial({color: 0x5B4B00})
          ];
        var tempFace = new THREE.Mesh( tempGeometry, materialsswoman02 );
        tempFace.position.set( - 5.05, wallBoost+1, 2.5 );
        tempFace.rotation.set( 0, Math.PI / 2, 0 );
        tempFace.userData.normal = new THREE.Vector3( 1, 0, 0 );
        tempFace.onBeforeRender = beforeRenderCB();
        tempFace.onAfterRender = afterRenderCB();
        scene.add( tempFace );

        // var tempGeometry = new THREE.BoxGeometry( 2, 2, 0.25 );
        // var tempTexture = new THREE.TextureLoader().load( './face01.jpg' );
        // tempTexture.wrapS = tempTexture.wrapT = THREE.RepeatWrapping;
        // var tempMaterial = new THREE.MeshPhongMaterial({map:tempTexture});
        // var tempFace = new THREE.Mesh( tempGeometry, tempMaterial );
        // tempFace.position.set( - 5.1, wallBoost+1, -2.5 );
        // tempFace.rotation.set( 0, Math.PI / 2, 0 );
        // tempFace.userData.normal = new THREE.Vector3( 1, 0, 0 );
        // tempFace.onBeforeRender = beforeRenderCB();
        // tempFace.onAfterRender = afterRenderCB();
        // scene.add( tempFace );
        

        

        var tempGeometry = new THREE.BoxGeometry( 1.6, 3.5, 0.01 );
        var tempTexture = new THREE.TextureLoader().load( './dm.jpg' );
        tempTexture.wrapS = tempTexture.wrapT = THREE.RepeatWrapping; 
        const materialss = [
            new THREE.MeshBasicMaterial({color: 0xE0E0E0}),new THREE.MeshBasicMaterial({color: 0xE0E0E0}),new THREE.MeshBasicMaterial({color: 0xE0E0E0}),
            new THREE.MeshBasicMaterial({color: 0xE0E0E0}),
            new THREE.MeshBasicMaterial({map: tempTexture}),
            new THREE.MeshBasicMaterial({color: 0xE0E0E0})
          ];
        // var tempMesh = new THREE.Mesh( tempGeometry, new THREE.MeshPhongMaterial({map:tempTexture, color: 0xf00000}) );
        var tempMesh = new THREE.Mesh( tempGeometry, materialss);
        
        // tempMesh.rotation.y -= 0.25; // Math.PI*1/11;
        tempMesh.rotation.x -= 0.2;//  Math.PI*11/11;
        tempMesh.position.y = 0.8;
        
        tempMesh.position.x = 3;
        tempMesh.receiveShadow = true;
        scene.add( tempMesh );

        // OrbitControls mouse move
        controls = new OrbitControls( camera, renderer.domElement );
        controls.maxPolarAngle = Math.PI / 2 - 0.1;
        controls.minPolarAngle = Math.PI / 3 - 0.15;
        // controls.maxAzimuthAngle = Math.PI *2/3 ;   //from 120 ~ -180 degree 
        // controls.minAzimuthAngle = -Math.PI ;
        controls.enableDamping = true;
        controls.enableZoom = true;
        controls.minDistance = 8;
        controls.maxDistance = 17;
        controls.enablePan = false;
        controls.dampingFactor = 0.1;
        controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
        controls.autoRotateSpeed = 0.2; // 30
        
        // Axis show
        // scene.add( new THREE.AxesHelper( 3 ) );

    }

    function initColor(parent, type, mtl) {
        parent.traverse((o) => {
         if (o.isMesh) {
            if (o.name.includes(type)) {
                    o.material = mtl;
                    o.nameID = type; // Set a new property to identify this object
            }
            }
        });
    }

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        var width = window.innerWidth;
        var height = window.innerHeight;
        var canvasPixelWidth = canvas.width / window.devicePixelRatio;
        var canvasPixelHeight = canvas.height / window.devicePixelRatio;
        
        const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
        if (needResize) {
            
            renderer.setSize(width, height, false);
        }
        return needResize;
    }


    function animate () {

        controls.update();
        // console.log(camera.position);
        // console.log(Math.abs(camera.position.x-camPosition[0]));
        if(Math.abs(camera.position.x-camPosition[0])>0.1 || Math.abs(camera.position.y-camPosition[1])>0.1 || Math.abs(camera.position.z-camPosition[2])>0.1 ){
            // console.log(camera.position);
            
            // console.log(180*controls.getAzimuthalAngle()/Math.PI);
            camPosition[0] = camera.position.x;
            camPosition[1] = camera.position.y;
            camPosition[2] = camera.position.z;
        }
        

        renderer.render(scene, camera);
        requestAnimationFrame(animate);

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
    }
    
    init();
    // wallCreate();
    animate();
    buildColors(colors);


    // Function - Build Colors
    function buildColors(colors) {
        for (let [i, color] of colors.entries()) {
            let swatch = document.createElement('div');
            swatch.classList.add('tray__swatch');
            if (color.texture){
                swatch.style.backgroundImage = "url(" + color.texture + ")";   
            } else{
                swatch.style.background = "#" + color.color;
            }
            swatch.setAttribute('data-key', i);
            TRAY.append(swatch);
        }
    }
  
    




    // Select Option
    const options = document.querySelectorAll(".option");

    for (const option of options) {
        option.addEventListener('click',selectOption);
    }

    function selectOption(e) {
        let option = e.target;
        activeOption = e.target.dataset.option;
        for (const otherOption of options) {
            otherOption.classList.remove('--is-active');
        }
        option.classList.add('--is-active');
        console.log('select successed !')
    }


    // Swatches
    const swatches = document.querySelectorAll(".tray__swatch");
    for (const swatch of swatches) {
        swatch.addEventListener('click', selectSwatch);
    }


    function selectSwatch(e) {
        let color = colors[parseInt(e.target.dataset.key)];
        let new_mtl;
        if (color.texture) {
      
            let txt = new THREE.TextureLoader().load(color.texture);
            
            txt.repeat.set( color.size[0], color.size[1], color.size[2]);
            txt.wrapS = THREE.RepeatWrapping;
            txt.wrapT = THREE.RepeatWrapping;
            
            new_mtl = new THREE.MeshPhongMaterial( {
              map: txt,
              shininess: color.shininess ? color.shininess : 10
            });    
        } 
        else{
            new_mtl = new THREE.MeshPhongMaterial({
                color: parseInt('0x' + color.color),
                shininess: color.shininess ? color.shininess : 10
                
            });
        }
       
        setMaterial(theModel, activeOption, new_mtl);
   }


   function setMaterial(parent, type, mtl) {
        parent.traverse((o) => {
            if (o.isMesh && o.nameID != null) {
                if (o.nameID == type) {
                        o.material = mtl;
                    }
            }
        });
    }


    function beforeRenderCB () {
        let v = new THREE.Vector3();
        return function onBeforeRender( renderer, scene, camera, geometry, material, group ) {
            // this is one way. adapt to your use case.
            if ( v.subVectors( camera.position, this.position ).dot( this.userData.normal ) < 0 ) {
                geometry.setDrawRange( 0, 0 );
                // console.log(v.subVectors( camera.position, this.position ));
            }
        };
    }
    
    function afterRenderCB () {
        return function onAfterRender( renderer, scene, camera, geometry, material, group ) {
            geometry.setDrawRange( 0, Infinity );
        };
    }








    function wallCreate(){
        const wallTall = 3;
        const wallHeigh = 9;
        const wallWidth = 7;
        //Simple A-frame roof
        var roofVertices2 = [
            new THREE.Vector3(0, 2, 0), new THREE.Vector3(2, 3, 0), new THREE.Vector3(4, 2, 0),
            new THREE.Vector3(4, 2, 4), new THREE.Vector3(2, 3, 4), new THREE.Vector3(0, 2, 4)
        ];

        var roofVertices = [
            new THREE.Vector3(0, wallTall, 0), new THREE.Vector3(wallWidth, wallTall, 0),
            new THREE.Vector3(wallWidth, wallTall, wallHeigh), new THREE.Vector3(0, wallTall, wallHeigh)
        ];

        
        // var material = new THREE.MeshPhongMaterial({
        var material = new THREE.MeshBasicMaterial({
            // color: 0xccffcc,
            // alphaTest:0,
            color: 0x666666,
            transparent : false,
            // visible  :true,
            side: THREE.DoubleSide,
            // opacity : 0.1,
            
        });

        for (var i = 0; i < roofVertices.length; i++) {
            console.log('i,',i)
        // for (var i = 0; i < 4; i++) {
            var v1 = roofVertices[i];
            var v2 = roofVertices[(i+1)%roofVertices.length];//wrap last vertex back to start
            console.log((i+1)%roofVertices.length)
            var wallGeometry = new THREE.Geometry();

            wallGeometry.vertices = [
                v1,
                v2,
                new THREE.Vector3(v1.x, 0, v1.z),
                new THREE.Vector3(v2.x, 0, v2.z)

                //順序變化沒關係 wall是抓取 此4點!
            ];

            //always the same for simple 2-triangle plane
            wallGeometry.faces = [new THREE.Face3(0, 1, 2), new THREE.Face3(1, 2, 3)];

            wallGeometry.computeFaceNormals();
            wallGeometry.computeVertexNormals();

            var wallMesh = new THREE.Mesh(wallGeometry, material);
            wallMesh.position.x -= wallWidth/2;
            wallMesh.position.y -= 1;
            wallMesh.position.z -= wallHeigh/2;
            // wallMesh.position.set(0, 50, 0);
            
            
            // scene.add(wallMesh);
            wallList.add(wallMesh);
        }
        console.log(wallList.children[1].material.visible);
        console.log(wallList.children[2].material);
        scene.add(wallList);
    }


