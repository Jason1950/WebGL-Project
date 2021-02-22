// three.js example - hiding walls based on camera position
import { OrbitControls } from './OrbitControls.js';
let mesh, renderer, scene, camera, controls;


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



init();
animate();

function init() {

    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x889988 );
    document.body.appendChild( renderer.domElement );

    // scene
    scene = new THREE.Scene();
    
    // camera
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 20, 20, 20 );
    scene.add( camera ); // required, since adding light as child of camera

    // controls
    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2;
    
    // ambient
    scene.add( new THREE.AmbientLight( 0x444444 ) );
    
    // light
    let light = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( light );
    
    // axes
    scene.add( new THREE.AxesHelper( 5 ) );

    // mesh  橘黃木櫃
    let originMesh = new THREE.Mesh( 
                            new THREE.BoxGeometry( 4, 2, 2 ), 
                            new THREE.MeshPhongMaterial( {color: 'sandybrown'} ) );
    originMesh.position.set( 2, - 4, 6 );
    scene.add( originMesh );

    // mesh  灰色木櫃
    let grayMesh = new THREE.Mesh( 
                        new THREE.BoxGeometry( 2, 2, 2 ),
                        new THREE.MeshPhongMaterial( {color: 'gray'} ) );
    grayMesh.position.set( -2 , - 4, - 6 );
    scene.add( grayMesh );


    // geometry
    let geometry = new THREE.BoxGeometry( 20.5, 10, 0.25 );
    
    // material
    let material = new THREE.MeshLambertMaterial( {
	    color: 0xffffff
    } );
    
	// callbacks
	let onBeforeRender = function() {

		let v = new THREE.Vector3();

		return function onBeforeRender( renderer, scene, camera, geometry, material, group ) {
			// this is one way. adapt to your use case.
			if ( v.subVectors( camera.position, this.position ).dot( this.userData.normal ) < 0 ) {

                geometry.setDrawRange( 0, 0 );
                // console.log(v.subVectors( camera.position, this.position ));

            }
            

		};

	}();

	let onAfterRender = function( renderer, scene, camera, geometry, material, group ) {

		geometry.setDrawRange( 0, Infinity );

	};

	// mesh
	mesh = new THREE.Mesh( geometry, material );
	mesh.position.set( 0, 0, 10.13 );
	mesh.rotation.set( 0, 0, 0 );
	scene.add( mesh );
	mesh.userData.normal = new THREE.Vector3( 0, 0, - 1 );
    // mesh.onBeforeRender = onBeforeRender;
    mesh.onBeforeRender = beforeRenderCB();
    
	mesh.onAfterRender = afterRenderCB();

	mesh
	mesh = new THREE.Mesh( geometry, material );
	mesh.position.set( 0, 0, - 10.13 );
	mesh.rotation.set( 0, 0, 0 );
	scene.add( mesh );
	mesh.userData.normal = new THREE.Vector3( 0, 0, 1 );
	mesh.onBeforeRender = onBeforeRender;
	mesh.onAfterRender = onAfterRender;

	// mesh
	mesh = new THREE.Mesh( geometry, material );
	mesh.position.set( 10.13, 0, 0 );
	mesh.rotation.set( 0, - Math.PI/2 , 0 );
	scene.add( mesh );
	mesh.userData.normal = new THREE.Vector3( - 1, 0, 0 );
	mesh.onBeforeRender = onBeforeRender;
	mesh.onAfterRender = onAfterRender;

	// mesh
	mesh = new THREE.Mesh( geometry, material );
	mesh.position.set( - 10.13, 0, 0 );
	mesh.rotation.set( 0, Math.PI / 2, 0 );
	// scene.add( mesh );
	// mesh.userData.normal = new THREE.Vector3( 1, 0, 0 );
	// mesh.onBeforeRender = onBeforeRender;
	// mesh.onAfterRender = onAfterRender;

    // geometry
    let geometryFloor = new THREE.BoxGeometry( 20.50, 20.50, 0.25 );

	// mesh - floor
	mesh = new THREE.Mesh( geometryFloor, material );
	mesh.position.set( 0, - 5.12, 0 );
	mesh.rotation.set( - Math.PI / 2, 0, 0 );
	scene.add( mesh );
	// mesh.userData.normal = new THREE.Vector3( 0, 1, 0 );
	// mesh.onBeforeRender = onBeforeRender;
	// mesh.onAfterRender = onAfterRender;

}

function animate() {

    requestAnimationFrame( animate );
    
    //controls.update();

    renderer.render( scene, camera );

}


