import * as THREE from 'three'
import { WEBGL } from './webgl'
import './modal'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import axios from 'axios';

let nftID = prompt('Please enter your NFT ID, or use our test one --> 62814d0eaa18ace952034dc7 PLEASE BE PATIENT, IT CAN TAKE AROUND A MINUTE FOR THE MODEL TO DOWNLOAD')
			let camera, scene, renderer;
			init();
			render();

			async function init() {

				const container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
				camera.position.set( - 1.8, 0.6, 2.7 );

				scene = new THREE.Scene();

				new RGBELoader()
					.setPath( 'src/textures/equirectangular/' )
					.load( 'converted.hdr', function ( texture ) {

						texture.mapping = THREE.EquirectangularReflectionMapping;

						scene.background = texture;
						scene.environment = texture;

						render();

						// model

						axios.get(`https://warm-journey-29417.herokuapp.com/nfts/${nftID}`, {
							params: {
							}
						})
						.then(function (response) {
							console.log(response);
							console.log(response.data.ipfsModelLinks)

							const loader = new GLTFLoader()
							loader.load( `${response.data.ipfsModelLinks}`, function ( gltf ) {
	
								scene.add( gltf.scene );
	
								render();
	
							} );
						})

					} );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.toneMapping = THREE.ACESFilmicToneMapping;
				renderer.toneMappingExposure = 1;
				renderer.outputEncoding = THREE.sRGBEncoding;
				container.appendChild( renderer.domElement );

				const controls = new OrbitControls( camera, renderer.domElement );
				controls.addEventListener( 'change', render ); // use if there is no animation loop
				controls.minDistance = 2;
				controls.maxDistance = 10;
				controls.target.set( 0, 0, - 0.2 );
				controls.update();

				window.addEventListener( 'resize', onWindowResize );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				render();

			}

			//

			function render() {

				renderer.render( scene, camera );

			}

