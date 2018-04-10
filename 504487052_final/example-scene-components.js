
  // **********************************************************************************
  // First go down to the following class's display() method to see where the sample
  // shapes you see drawn are coded, and a good place to begin filling in your own code.


//GLOBAL VARIABLES

 var continue1 = false;
 var continue2 = false;
 var continue3 = false;
 var continue4 = false;
 var continue5 = false;

 var e_pressed = false;
 var l_pressed = false;
 var g_pressed = false;
 var y_pressed = false;
 var e_start = 0;
 var l_start = 0;
 var g_start = 0;
 var y_start = 0;

 var eyes_up = false;

 var bridge = false;

 var dia1 = false;
 var dia2 = false;
 var dia3 = false;
 var dia4 = false;
 var dia5 = false;
 var dia6 = false;

 var time_now = 0;
 var time_now_2 = 0;
 var first = true;
 var second = true;

 var stop = false;



Declare_Any_Class( "Example_Animation",  // An example of a Scene_Component that our class Canvas_Manager can manage.  This one draws the scene's 3D shapes.
{ 'construct'( context )
      { var shapes = { 'triangle'        : new Triangle(),                               // At the beginning of our program, instantiate all shapes we plan to use,
                       'strip'           : new Square(),                                // each with only one instance in the graphics card's memory.
                       'bad_tetrahedron' : new Tetrahedron( false ),                   // For example we would only create one "cube" blueprint in the GPU, but then
                       'tetrahedron'     : new Tetrahedron( true ),                   // re-use it many times per call to display to get multiple cubes in the scene.
                       'windmill'        : new Windmill( 10 ) };
        this.submit_shapes( context, shapes );
        // *** Materials: *** Declare new ones as temps when needed; they're just cheap wrappers for some numbers.  1st parameter:  Color (4 floats in RGBA format),
        // 2nd: Ambient light, 3rd: Diffuse reflectivity, 4th: Specular reflectivity, 5th: Smoothness exponent, 6th: Optional texture object, leave off for un-textured.
        this.define_data_members( { purplePlastic: context.shaders_in_use["Phong_Model" ].material( Color( .9,.5,.9, 1 ), .4, .4, .8, 40 ),
                                    greyPlastic  : context.shaders_in_use["Phong_Model" ].material( Color( .5,.5,.5, 1 ), .4, .8, .4, 20 ),   // Smaller exponent means
                                    blueGlass    : context.shaders_in_use["Phong_Model" ].material( Color( .5,.5, 1,.2 ), .4, .8, .4, 40 ),     // a bigger shiny spot.
                                    fire         : context.shaders_in_use["Funny_Shader"].material() } );
      },
    'display'( graphics_state )
      { var model_transform = identity();             // We have to reset model_transform every frame.

        // *** Lights: *** Values of vector or point lights over time.  Two different lights *per shape* supported; more requires changing a number in the vertex shader.
        graphics_state.lights = [ new Light( vec4(  30,  30,  34, 1 ), Color( 0, .4, 0, 1 ), 100000 ),      // Arguments to construct a Light(): Light source position or
                                  new Light( vec4( -10, -20, -14, 0 ), Color( 1, 1, .3, 1 ), 100    ) ];    // vector (homogeneous coordinates), color, and size.
        /**********************************
        Start coding down here!!!!
        **********************************/                                     // From here on down it's just some example shapes drawn
                                                                                // for you -- freely replace them with your own!
        model_transform = mult( model_transform, translation( 0, 5, 0 ) );
        this.shapes.triangle       .draw( graphics_state, model_transform,                      this.purplePlastic );

        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        this.shapes.strip          .draw( graphics_state, model_transform,                      this.greyPlastic   );

        var t = graphics_state.animation_time/1000,   tilt_spin   = rotation( 700*t, [          .1,          .8,             .1 ] ),
                                                      funny_orbit = rotation(  90*t, [ Math.cos(t), Math.sin(t), .7*Math.cos(t) ] );

        // Many shapes can share influence from the same pair of lights, but they don't have to.  All the following shapes will use these lights instead of the above ones.
        graphics_state.lights = [ new Light( mult_vec( tilt_spin, vec4(  30,  30,  34, 1 ) ), Color( 0, .4, 0, 1 ), 100000               ),
                                  new Light( mult_vec( tilt_spin, vec4( -10, -20, -14, 0 ) ), Color( 1, 1, .3, 1 ), 100*Math.cos( t/10 ) ) ];

        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        this.shapes.tetrahedron    .draw( graphics_state, mult( model_transform, funny_orbit ), this.purplePlastic );

        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        this.shapes.bad_tetrahedron.draw( graphics_state, mult( model_transform, funny_orbit ), this.greyPlastic   );

        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        this.shapes.windmill       .draw( graphics_state, mult( model_transform, tilt_spin ),   this.purplePlastic );
        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        this.shapes.windmill       .draw( graphics_state, model_transform,                      this.fire          );
        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        this.shapes.windmill       .draw( graphics_state, model_transform,                      this.blueGlass     );
      }
  }, Scene_Component );  // End of class definition


  // *******************************************************************
  //  Assignment 1 would fit nicely into the following class definition:



Declare_Any_Class( "River_Crossing",  // An example of drawing a hierarchical object using a "model_transform" matrix and post-multiplication.
  { 'construct'( context )
  { var shapes = { 'triangle'        : new Triangle(),                               // At the beginning of our program, instantiate all shapes we plan to use,
                   'strip'           : new Square(),                                // each with only one instance in the graphics card's memory.
                   'bad_tetrahedron' : new Tetrahedron( false ),                   // For example we would only create one "cube" blueprint in the GPU, but then
                   'tetrahedron'     : new Tetrahedron( true ),                   // re-use it many times per call to display to get multiple cubes in the scene.
                   'windmill'        : new Windmill( 10 ),
                   'ball'            : new Grid_Sphere( 10, 10 ),
                   'good_sphere'     : new Subdivision_Sphere( 8 ),
                   'box'             : new Cube(),
                   'mini_cube'       : new Mini_Cube(),
                   'Ground'          : new Rectangle( 500, 500 ),
                   'Man_Center'      : new Rect_Prism( 1.5, .87, 3 ),
                   'Wings'           : new Rect_Prism( 2.5, 1.5, .05 ),
                   'Man_Legs'        : new Rect_Prism( .6, .7, 1 ),
                   'Lower_Legs'      : new Rect_Prism( .6, .6, 1 ),
                   'Stem_Part'       : new Rect_Prism( .6, .6, 1 ),
                   'Arms'            : new Rect_Prism(.4, .4, 1.5),
                   'outer_box'       : new Rect_Prism( 1, 1, 1),
                   'grass'           : new Rect_Prism( .1, .1, .9),
                   'Diamond'         : new Diamond(),

                   //dia0
                   'text0'           : new Text_Line( 20 ),

                   //dia1
                   'text1'           : new Text_Line( 12 ),
                   'text2'           : new Text_Line( 20 ),
                   'text3'           : new Text_Line( 25 ),
                   'text4'           : new Text_Line( 25 ),

                   //dia2
                   'text5'           : new Text_Line( 35 ),
                   'text6'           : new Text_Line( 35 ),

                   //dia3
                   'text7'           : new Text_Line( 35 ),

                   'weed'            : new Plant(.1, .1, .9)
        };

        this.submit_shapes( context, shapes );

        this.define_data_members( { purplePlastic : context.shaders_in_use["Phong_Model" ].material( Color( .9, .2, .9,  1 ), .4, .4, .8, 40 ),
                                    flowerSphere  : context.shaders_in_use["Phong_Model" ].material( Color(  1, .5, .1,  1 ),  1, .5, .5, 40 ),
                                    greyPlastic   : context.shaders_in_use["Phong_Model" ].material( Color( .5, .5, .5,  1 ), .4, .8, .4, 20 ),   // Smaller exponent means
                                    blueGlass     : context.shaders_in_use["Phong_Model" ].material( Color( .5, .5,  1, .2 ), .4, .8, .4, 40 ),     // a bigger shiny spot.
                                    yellow_clay   : context.shaders_in_use["Phong_Model" ].material( Color(  1,  1, .3,  1 ), .2,  1, .7, 40 ),
                                    brown_clay    : context.shaders_in_use["Phong_Model" ].material( Color( .5, .5, .3,  1 ), .2,  1,  1, 40 ),
                                    black_clay    : context.shaders_in_use["Phong_Model" ].material( Color( .5, .5, .3,  1 ), .2, .1,  1, 40 ),
                                    Grass         : context.shaders_in_use["Phong_Model" ].material( Color(  0,  1,  0,  .9 ), .5, .8, .4,  100, context.textures_in_use["grass.png"] ),
                                    Weeds         : context.shaders_in_use["Phong_Model" ].material( Color(  0,  100,  0,  .8 ), .8, .1, .4,  40 ),
                                    waves         : context.shaders_in_use["Phong_Model" ].material( Color(  0,  .2, .5,  .8 ), .8, .1, .4, 100, context.textures_in_use["water.png"] ),
                                    stream_bed    : context.shaders_in_use["Phong_Model" ].material( Color(  0,  0, 100,  .8 ), .8, .1, .4,  40 ),
                                    heart         : context.shaders_in_use["Phong_Model" ].material( Color(  1,  0, 0,  1 ), .8, .1, .4,  40 ),
                                    vein          : context.shaders_in_use["Phong_Model" ].material( Color(  1,  0, 0,  .7 ), .8, .1, .4,  40 ),
                                    text_material : context.shaders_in_use["Phong_Model" ].material( Color(  0, 0, 0, 1 ), 1, 0, 0, 40, context.textures_in_use["text.png"] ),
                                    shirt         : context.shaders_in_use["Phong_Model" ].material( Color(  .5,  .5, .5,  1 ), .5, .5, .5, 100, context.textures_in_use["shirt.png"] ),
                                    fire          : context.shaders_in_use["Funny_Shader"].material() } );

        },
    'display'( graphics_state )
      { var model_transform = identity();             // We have to reset model_transform every frame.

        var audio = new Audio('music.mp3');

        // *** Lights: *** Values of vector or point lights over time.  Two different lights *per shape* supported; more requires changing a number in the vertex shader.
        graphics_state.lights = [ new Light( vec4(  30,  30,  34, 1 ), Color( 0, .4, 0, 1 ), 100000 ),      // Arguments to construct a Light(): Light source position or
                                  new Light( vec4( -10, -20, -14, 0 ), Color( 1, 1, .3, 1 ), 100    ) ];    // vector (homogeneous coordinates), color, and size.

        /**********************************
        Start coding down here!!!!
        **********************************/                                     // From here on down it's just some example shapes drawn
                                                                                // for you -- freely replace them with your own!

        var t = graphics_state.animation_time/1000,   tilt_spin   = rotation( 700*t, [          .1,          .8,             .1 ] ),
                                                      funny_orbit = rotation(  90*t, [ Math.cos(t), Math.sin(t), .7*Math.cos(t) ] );

        var t2 = 2*t;


        //eye, at, up
        //eye = position of camera's viewpoint
        //at = where the camera is looking at
        //up = world's upward direction


        //Starting camera view
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //TO SEE WORLD WITHOUT THE STORY LINE, COMMENT THIS LINE OUT!!
        graphics_state.camera_transform = lookAt(vec3(-49.5,-10.75,0), vec3(-50,-10.75,0), vec3(0,1,0));
        dia0 = true;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




        function animation1(t, start) {
          if ((t-start) < 8) {
            audio.play();
            return lookAt(vec3(-49.5,-10.75,0), vec3(-50,-10.75,0), vec3(0,1,0));
          }
          else if ((t-start) >= 8 && (t-start) <= 18) {
            return lookAt(vec3(-49.5+((t-start)-8),-10.75,0), vec3(-50,-10.75,0), vec3(0,1,0));
          }
          else if ((t-start) > 18 && (t-start) <= 20) {
            return lookAt(vec3(-39.5,-10.75+((t-start)-18),0), vec3(-50,-10.75+((t-start)-18),0), vec3(0,1,0));
          }
          else {
            dia1 = true;
            dia0 = false;
            return lookAt(vec3(-39.5,-8.75,0), vec3(-50,-8.75,0), vec3(0,1,0));
          }
        }

        function animation2(t, start) {
          dia1 = false;
          if ((t-start) <= 12) {
            return lookAt(vec3(-39.5+(3*(t-start)),-8.75+((t-start)*.4),0), vec3(-50,-8.75,0), vec3(0,1,0));
          }
          else {
            dia2 = true;
            return lookAt(vec3(-3.5,-3.95,0), vec3(-50,-8.75,0), vec3(0,1,0));
          }
        }


        function animation3(t, start) {
          dia2 = false;
          if ((t-start) <= 2) {
            return lookAt(vec3(-3.5-(14*(t-start)),-3.95-(2.4*(t-start)),0), vec3(-50+(8*(t-start)),-8.75,0), vec3(0,1,0));
          }
          else if ((t-start) > 2 && (t-start) <= 5) {
            eyes_up = true; //move his eyes up
            return lookAt(vec3(-31.5,-8.75,0), vec3(-34,-8.75,0), vec3(0,1,0));
          }
          else {
            dia3 = true;
            return lookAt(vec3(-25,0,0), vec3(0,0,0), vec3(0,1,0));
          }
        }

        function animation4(t, start) {
          if ((t-start) <= 8) {
            dia3 = false;
            dia4 = true;
            return lookAt(vec3(-31.5,-8.75,0), vec3(-34,-8.75,0), vec3(0,1,0)); //looking at person ("Hi God, can you help me cross this river?")
          }
          else if ((t-start) > 8 && (t-start) <= 15) {
            dia4 = false;
            dia5 = true;
            return lookAt(vec3(-25,0,0), vec3(0,0,0), vec3(0,1,0)); //looking at God (Of course! I'll create a bridge for you")
          }
          else if ((t-start) > 15 && (t-start) <= 20) {
            dia5 = false;
            dia6 = true;
            return lookAt(vec3(-31.5,-8.75,0), vec3(-34,-8.75,0), vec3(0,1,0)); //looking at person ("Thanks God!")
          }
          else if ((t-start) > 20 && (t-start) <= 22) {
            eyes_up = false;
            dia6 = false;
            return lookAt(vec3(-3.5,-3.95,0), vec3(-50,-8.75,0), vec3(0,1,0)); //Looking at river with bridge
          }
          else {
            bridge = true;
            continue5 = true;
            return lookAt(vec3(-3.5,-3.95,0), vec3(-50,-8.75,0), vec3(0,1,0)); //Looking at river with bridge
          }
        }


      //First part (heart to person)
      if (l_pressed == false) {
        if (continue1 == true) {
          if (e_pressed == false) {
            e_start = t2;
            e_pressed = true;
          }
          graphics_state.camera_transform = animation1(t2, e_start);
        }
      }

      //Second part (person to river)
      if (g_pressed == false) {
        if (continue1 == true) {
          if (continue2 == true) {
            if (l_pressed == false) {
              l_start = t2;
              l_pressed = true;
            }
            graphics_state.camera_transform = animation2(t2, l_start);
          }
        }
      }

      //Third part (person to god)
      if (y_pressed == false) {
        if (continue1 == true) {
          if (continue2 == true) {
            if (continue3 == true) {
              if (g_pressed == false) {
                g_start = t2;
                g_pressed = true;
              }
              graphics_state.camera_transform = animation3(t2, g_start);
            }
          }
        }
      }
      //Conversation, then cross river
      if (continue1 == true) {
        if (continue2 == true) {
          if (continue3 == true) {
            if (continue4 == true) {
              if (y_pressed == false) {
                y_start = t2;
                y_pressed = true;
              }
              graphics_state.camera_transform = animation4(t2, y_start);
           }
         }
      }
    }

        //Rotation Matrices
        var matrix_radius_hor = mult(mult(model_transform, rotation(-120*t, vec3(0,1,0))), translation(0,0,0));
        //var matrix_radius_vert = mult(mult(model_transform, rotation(-120*t, vec3(1,0,0))), translation(0,0,0));

        //var matrix_radius_hor_rev = mult(mult(model_transform, rotation(120*t, vec3(0,1,0))), translation(0,0,0));
        var matrix_radius_vert_rev = mult(mult(model_transform, rotation(120*t, vec3(1,0,0))), translation(0,0,0));


        // Many shapes can share influence from the same pair of lights, but they don't have to.  All the following shapes will use these lights instead of the above ones.
        //graphics_state.lights = [ new Light( mult_vec( tilt_spin, vec4(  30,  30,  34, 1 ) ), Color( 0, .4, 0, 1 ), 100000               ),
          //                        new Light( mult_vec( tilt_spin, vec4( -10, -20, -14, 0 ) ), Color( 1, 1, .3, 1 ), 100*Math.cos( t/10 ) ) ];
        graphics_state.lights = [ new Light( mult_vec( rotation( t/5, 1, 0, 0 ), vec4(  3,  2,  10, 1 ) ), Color( 1, .7, .7, 1 ), 100000 ) ];


        var RADIUS = 8.5;

        //sine variables
        var sine = Math.sin(3*t);
        var sine1 = Math.sin(3.5*t);
        var sine2 = Math.sin(4*t);


        if (dia0 == true && continue1 == false) {
          var font_scale = rotation(90, vec3(0,1,0));
          font_scale     = mult(font_scale, translation( -14.4, -527, -2505));
          font_scale     = mult(scale( .02, .02, .02 ), font_scale );
          this.shapes.text0.set_string( "Press alt-a, then e." );
          this.shapes.text0.draw( graphics_state, font_scale, this.text_material );
        }


        if (dia1 == true) {
          var font_scale = rotation(90, vec3(0,1,0));    //z  //y //x
          font_scale     = mult(font_scale, translation( 0, -25, -250));
          font_scale     = mult(scale( .2, .2, .2 ), font_scale );
          this.shapes.text1.set_string( "Hello there." );
          this.shapes.text1.draw( graphics_state, font_scale, this.text_material );
          font_scale     = mult(font_scale, translation( 0, -2.5, 0));
          this.shapes.text2.set_string( "My name is Adam." );
          this.shapes.text2.draw( graphics_state, font_scale, this.text_material );
          font_scale     = mult(font_scale, translation( 0, -2.5, 0));
          this.shapes.text3.set_string( "Let's go on a walk!" );
          this.shapes.text3.draw( graphics_state, font_scale, this.text_material );
          font_scale     = mult(font_scale, translation( 0, -2.5, 0));
          this.shapes.text4.set_string( "Press l to continue" );
          this.shapes.text4.draw( graphics_state, font_scale, this.text_material );
        }

        if (dia2 == true) {
          var font_scale = rotation(90, vec3(0,1,0));;    //z  //y //x
          font_scale     = mult(font_scale, translation( -23, 0, -60));
          font_scale     = mult(scale( .4, .4, .4 ), font_scale );
          this.shapes.text5.set_string( "Oh No! I can't cross this river." );
          this.shapes.text5.draw( graphics_state, font_scale, this.text_material );
          font_scale     = mult(font_scale, translation( 0, -4, 0));
          this.shapes.text6.set_string( "Press g to continue." );
          this.shapes.text6.draw( graphics_state, font_scale, this.text_material );
        }

        if (dia3 == true) {
          var font_scale = rotation(-90, vec3(0,1,0));;    //z  //y //x
          font_scale     = mult(font_scale, translation( 13, 15, 15));
          font_scale     = mult(scale( .26, .26, .26 ), font_scale );
          this.shapes.text7.set_string( "Hello, I am God" );
          this.shapes.text7.draw( graphics_state, font_scale, this.text_material );
          font_scale     = mult(font_scale, translation( 0, -3, 0));
          this.shapes.text6.set_string( "Press y to continue." );
          this.shapes.text6.draw( graphics_state, font_scale, this.text_material );
        }

        if (dia4 == true) {
          var font_scale = rotation(90, vec3(0,1,0));;    //z  //y //x
          font_scale     = mult(font_scale, translation( 0, -25, -220));
          font_scale     = mult(scale( .2, .2, .2 ), font_scale );
          this.shapes.text1.set_string( "Hi God." );
          this.shapes.text1.draw( graphics_state, font_scale, this.text_material );
          font_scale     = mult(font_scale, translation( 0, -2.5, 0));
          this.shapes.text2.set_string( "Can you help me" );
          this.shapes.text2.draw( graphics_state, font_scale, this.text_material );
          font_scale     = mult(font_scale, translation( 0, -2.5, 0));
          this.shapes.text3.set_string( "cross this river?" );
          this.shapes.text3.draw( graphics_state, font_scale, this.text_material );
        }

        if (dia5 == true) {
          var font_scale = rotation(-90, vec3(0,1,0));;    //z  //y //x
          font_scale     = mult(font_scale, translation( 13, 15, 15));
          font_scale     = mult(scale( .26, .26, .26 ), font_scale );
          this.shapes.text7.set_string( "Of Course!" );
          this.shapes.text7.draw( graphics_state, font_scale, this.text_material );
          font_scale     = mult(font_scale, translation( 0, -3, 0));
          this.shapes.text6.set_string( "I'll make a bridge." );
          this.shapes.text6.draw( graphics_state, font_scale, this.text_material );
        }

        if (dia6 == true) {
          var font_scale = rotation(90, vec3(0,1,0));;    //z  //y //x
          font_scale     = mult(font_scale, translation( 0, -25, -220));
          font_scale     = mult(scale( .2, .2, .2 ), font_scale );
          this.shapes.text1.set_string( "Thanks God!" );
          this.shapes.text1.draw( graphics_state, font_scale, this.text_material );
        }


        //GOD
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //Center
        var flower = mult(matrix_radius_hor, scale(3, 3, 3));
        flower = mult(flower, translation(0, 0, 0));
        flower = mult(flower, rotation(90, vec3(0,1,0)));
        this.shapes.good_sphere.draw( graphics_state, flower, this.flowerSphere);

        //Adjacent spheres

        //Rotation around flower horizontally
        var close = mult(flower, rotation(0, vec3(0, 0, 1)));
        close = mult(close, scale(.2, .2, .2));
        close = mult(close, translation(6, 0, 0));
        this.shapes.good_sphere.draw( graphics_state, close, this.purplePlastic )

        //Rotating spheres
        for (let i = 1; i < 16; i++) {

          close = mult(flower, rotation(22.5*i, vec3(0, 0, 1)));
          close = mult(close, scale(.2, .2, .2));
          close = mult(close, translation(6, 0, 0));
          this.shapes.good_sphere.draw( graphics_state, close, this.purplePlastic )
        }

        flower = mult(model_transform, translation(0, 0, 0));

        //right
        var far = mult(flower, translation(0, 0, 0));
        far = mult(far, translation(0, 0, -6.5));
        far = mult(far, rotation(90, vec3(0,1,0)));
        this.shapes.outer_box.draw( graphics_state, far, this.greyPlastic )


        var matrix_radius_box = mult(mult(far, rotation(-120*t, vec3(1,0,0))), translation(0,0,0));
        var matrix_radius_box_rev = mult(mult(far, rotation(120*t, vec3(1,0,0))), translation(0,0,0));

        var RADIUS = .5;

        //normal rotating box
        var rot_box = mult(matrix_radius_box, translation(RADIUS, 0, 0));

        var sine = Math.sin(3*t);
        rot_box = mult(rot_box, translation(2*sine, 0, 0));

        var moving_box = mult(rot_box, translation(-.5, 1, 0));
        moving_box = mult(moving_box, scale(.6, .6, .6));
        this.shapes.Diamond.draw( graphics_state, moving_box, this.blueGlass )

        //reverse rotating box
        rot_box = mult(matrix_radius_box_rev, translation(RADIUS, 0, 0));
        rot_box = mult(rot_box, translation(2*sine, 0, 0));

        moving_box = mult(rot_box, translation(-.5, -1, 0));
        moving_box = mult(moving_box, scale(.6, .6, .6));
        this.shapes.Diamond.draw( graphics_state, moving_box, this.blueGlass )


        //left
        far = mult(far, translation(-13, 0, 0));
        this.shapes.outer_box.draw( graphics_state, far, this.greyPlastic )

        matrix_radius_box = mult(mult(far, rotation(-120*t, vec3(1,0,0))), translation(0,0,0));
        matrix_radius_box_rev = mult(mult(far, rotation(120*t, vec3(1,0,0))), translation(0,0,0));

        rot_box = mult(matrix_radius_box, translation(RADIUS, 0, 0));
        rot_box = mult(rot_box, translation(-2*sine,0 ,0));
        moving_box = mult(rot_box, translation(-.5, 1, 0));
        moving_box = mult(moving_box, scale(.6, .6, .6));
        this.shapes.Diamond.draw( graphics_state, moving_box, this.blueGlass )

        //reverse rotating box
        rot_box = mult(matrix_radius_box_rev, translation(RADIUS, 0, 0));
        rot_box = mult(rot_box, translation(-2*sine, 0, 0));

        moving_box = mult(rot_box, translation(-.5, -1, 0));
        moving_box = mult(moving_box, scale(.6, .6, .6));
        this.shapes.Diamond.draw( graphics_state, moving_box, this.blueGlass )

        //top
        far = mult(far, translation(6.5, 6.5, 0));
        this.shapes.outer_box.draw( graphics_state, far, this.greyPlastic )

        matrix_radius_box = mult(mult(far, rotation(-120*t, vec3(0,1,0))), translation(0,0,0));
        matrix_radius_box_rev = mult(mult(far, rotation(120*t, vec3(0,1,0))), translation(0,0,0));

        rot_box = mult(matrix_radius_box_rev, translation(RADIUS, 0, 0));
        rot_box = mult(rot_box, translation(0, 2*sine, 0));
        moving_box = mult(rot_box, translation(1, 0, 0));
        moving_box = mult(moving_box, scale(.6, .6, .6));
        this.shapes.Diamond.draw( graphics_state, moving_box, this.blueGlass )

        //reverse rotating box
        rot_box = mult(matrix_radius_box, translation(RADIUS, 0, 0));
        rot_box = mult(rot_box, translation(0, 2*sine, 0));

        moving_box = mult(rot_box, translation(-2, 0, 0));
        moving_box = mult(moving_box, scale(.6, .6, .6));
        this.shapes.Diamond.draw( graphics_state, moving_box, this.blueGlass )

        //bottom
        far = mult(far, translation(0, -13, 0));
        this.shapes.outer_box.draw( graphics_state, far, this.greyPlastic )

        matrix_radius_box = mult(mult(far, rotation(-120*t, vec3(0,1,0))), translation(0,0,0));
        matrix_radius_box_rev = mult(mult(far, rotation(120*t, vec3(0,1,0))), translation(0,0,0));

        rot_box = mult(matrix_radius_box_rev, translation(RADIUS, 0, 0));
        rot_box = mult(rot_box, translation(0, -2*sine, 0));
        moving_box = mult(rot_box, translation(1, 0, 0));
        moving_box = mult(moving_box, scale(.6, .6, .6));
        this.shapes.Diamond.draw( graphics_state, moving_box, this.blueGlass )

        //reverse rotating box
        rot_box = mult(matrix_radius_box, translation(RADIUS, 0, 0));
        rot_box = mult(rot_box, translation(0, -2*sine, 0));

        moving_box = mult(rot_box, translation(-2, 0, 0));
        moving_box = mult(moving_box, scale(.6, .6, .6));
        this.shapes.Diamond.draw( graphics_state, moving_box, this.blueGlass )

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




        //GROUND
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var ground = mult(model_transform, translation(0, -14, 0));
        ground = mult(ground, rotation(90, vec3(1, 0, 0)));
        this.shapes.Ground.draw( graphics_state, ground, this.Grass );

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



        //PERSON (Adam)
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //Man body ( 1.5, 1, 3 )
        var body = mult(model_transform, translation(-50, -10.75, 0));
        body = mult(body, rotation(90, vec3(0,1,0)));
        if (continue2 == true) {
            if (first == true) {
              time_now = t;
              first = false;
            }
            if ((t-time_now) <= 6) {
              body = mult(body, translation(0, 0, (0+(2*(t-time_now)))));
              this.shapes.Man_Center.draw( graphics_state, body, this.shirt);
            }
            else if (continue5 == false) {
              body = mult(body, translation(0, 0, 12));
              this.shapes.Man_Center.draw( graphics_state, body, this.shirt);
              stop = true;
              //continue2 = false;
            }
            else {
              if (second == true) {
                time_now_2 = t;
                second = false;
                //body = mult(body, translation(0, 0, 24));
                //this.shapes.Man_Center.draw( graphics_state, body, this.shirt);
              }
              if ((t-time_now_2) <= 6) {
                stop = false;
                //body = mult(body, translation(0, 0, 12));
                //this.shapes.Man_Center.draw( graphics_state, body, this.shirt);
                body = mult(body, translation(0, .6, (12+(3*(t-time_now_2)))));
                this.shapes.Man_Center.draw( graphics_state, body, this.shirt);
              }
              else {
                stop = true;
                bridge = false;
                body = mult(body, translation(0, -.6, 30));
                this.shapes.Man_Center.draw( graphics_state, body, this.shirt);
              }
            }
        }
        else {
          this.shapes.Man_Center.draw( graphics_state, body, this.shirt);
        }

        var heart = mult(body, translation(0, 0, 0));
        heart = mult(heart, rotation(30, vec3(0,0,1)));
        heart = mult(heart, scale(.1, .13, .1));
        this.shapes.good_sphere.draw( graphics_state, heart, this.heart);

        var vein = mult(heart, translation(.55,.5,0));
        vein = mult(vein, scale(.2, .5, .5));
        this.shapes.good_sphere.draw( graphics_state, vein, this.heart);

        var vein = mult(heart, translation(-.65,.2,.6));
        vein = mult(vein, scale(.2, .5, .5));
        this.shapes.good_sphere.draw( graphics_state, vein, this.heart);

        var vein = mult(heart, translation(-1.5,-.7,0));
        vein = mult(vein, scale(2, .1, .9));
        this.shapes.good_sphere.draw( graphics_state, vein, this.vein);

        var vein = mult(heart, translation(1.5,.8,0));
        vein = mult(vein, rotation(50, vec3(0,0,1)));
        vein = mult(vein, scale(2, .1, .9));
        this.shapes.good_sphere.draw( graphics_state, vein, this.vein);

        var heart2 = mult(heart, translation(0, -.25, 0));
        heart2 = mult(heart2, scale(.5, .5, .5));
        heart2 = mult(heart2, scale(1+sine2, 1+sine2, 1+sine2));
        this.shapes.good_sphere.draw( graphics_state, heart2, this.heart);


        //shoulders
        var left_should = mult(body, translation(.6, 1.15, 0));
        left_should = mult(left_should, scale(.4, .4, .4));
        this.shapes.good_sphere.draw( graphics_state, left_should, this.shirt);

        var right_should = mult(body, translation(-.6, 1.15, 0));
        right_should = mult(right_should, scale(.4, .4, .4));
        this.shapes.good_sphere.draw( graphics_state, right_should, this.shirt);

        var upper_arm_left = mult(body, translation(1.1, 1, 0));
        if (continue2 == true && stop == false) {
          upper_arm_left = mult(upper_arm_left, rotation(35*sine, vec3(1,0,0)));
        }
        upper_arm_left = mult(upper_arm_left, translation(0, -1, 0));
        upper_arm_left = mult(upper_arm_left, rotation(15, vec3(0,0,1)));
        upper_arm_left = mult(upper_arm_left, scale(.3, .8, .3));
        upper_arm_left = mult(upper_arm_left, translation(.1, .8, 0));
        this.shapes.good_sphere.draw( graphics_state, upper_arm_left, this.shirt);

        var upper_arm_right = mult(body, translation(-1.1, 1, 0));
        if (continue2 == true && stop == false) {
          upper_arm_right = mult(upper_arm_right, rotation(-35*sine, vec3(1,0,0)));
        }
        upper_arm_right = mult(upper_arm_right, translation(0, -1, 0));
        upper_arm_right = mult(upper_arm_right, rotation(-15, vec3(0,0,1)));
        upper_arm_right = mult(upper_arm_right, scale(.3, .8, .3));
        upper_arm_right = mult(upper_arm_right, translation(-.1, .8, 0));
        this.shapes.good_sphere.draw( graphics_state, upper_arm_right, this.shirt);


        //man head
        var head = mult(body, translation(0, 2.2, 0));
        head = mult(head, scale(.6, .7, .7));
        this.shapes.good_sphere.draw( graphics_state, head, this.yellow_clay);


        if (eyes_up == false) {

          var eyes = mult(body, translation(-.2 ,2.3, .5));
          eyes = mult(eyes, scale(.2, .2, .2));
          this.shapes.good_sphere.draw( graphics_state, eyes, this.black_clay);

          eyes = mult(eyes, translation(2 ,0, 0));
          this.shapes.good_sphere.draw( graphics_state, eyes, this.black_clay);

          eyes = mult(eyes, translation(-1 ,-2, 0));
          eyes = mult(eyes, scale(1, .2, 1));
          this.shapes.good_sphere.draw( graphics_state, eyes, this.black_clay);
        }
        else
        {
          var eyes = mult(body, translation(-.2 ,2.5, .5));
          eyes = mult(eyes, scale(.2, .2, .2));
          this.shapes.good_sphere.draw( graphics_state, eyes, this.black_clay);

          eyes = mult(eyes, translation(2 ,0, 0));
          this.shapes.good_sphere.draw( graphics_state, eyes, this.black_clay);

        }

        var eyes = mult(body, translation(-.2 ,2.3, .5));
        eyes = mult(eyes, scale(.2, .2, .2));

        eyes = mult(eyes, translation(2 ,0, 0));

        eyes = mult(eyes, translation(-1 ,-2, 0));
        eyes = mult(eyes, scale(1, .2, 1));
        this.shapes.good_sphere.draw( graphics_state, eyes, this.black_clay);


        //Arms (.4, .4, 1.5)
        var left_arm = mult(body, translation(1.1, 1, 0));
        if (continue2 == true && stop == false) {
          left_arm = mult(left_arm, rotation(35*sine, vec3(1,0,0)));
        }
        left_arm = mult(left_arm, translation(0, -1, 0));
        left_arm = mult(left_arm, rotation(15, vec3(0,0,1)));
        left_arm = mult(left_arm, scale(.25, 1.1, .25));
        this.shapes.good_sphere.draw( graphics_state, left_arm, this.yellow_clay);

        var right_arm = mult(body, translation(-1.1, 1, 0));
        if (continue2 == true && stop == false) {
          right_arm = mult(right_arm, rotation(-35*sine, vec3(1,0,0)));
        }
        right_arm = mult(right_arm, translation(0, -1, 0));
        right_arm = mult(right_arm, rotation(-15, vec3(0,0,1)));
        right_arm = mult(right_arm, scale(.25, 1.1, .25));
        this.shapes.good_sphere.draw( graphics_state, right_arm, this.yellow_clay);

        //hands
        var left_hand = mult(left_arm, translation(0, 0, 0));
        if (continue2 == true && stop == false) {
          left_hand = mult(left_hand, rotation(40*sine, vec3(0,1,0)));
        }
        left_hand = mult(left_hand, translation(0, -1, 0));
        left_hand = mult(left_hand, rotation(15, vec3(0,0,1)));
        left_hand = mult(left_hand, scale(.7, .3, 1));
        this.shapes.good_sphere.draw( graphics_state, left_hand, this.yellow_clay);

        var right_hand = mult(right_arm, translation(0, 0, 0));
        if (continue2 == true && stop == false) {
          right_hand = mult(right_hand, rotation(40*sine, vec3(0,1,0)));
        }
        right_hand = mult(right_hand, translation(0, -1, 0));
        right_hand = mult(right_hand, rotation(-15, vec3(0,0,1)));
        right_hand = mult(right_hand, scale(.7, .3, 1));
        this.shapes.good_sphere.draw( graphics_state, right_hand, this.yellow_clay);


        //upper legs
        //Man legs ( .6, .7, 1)
        var left_leg = mult(body, translation(-.45, -1.5, 0));
        if (continue2 == true && stop == false) {
          left_leg = mult(left_leg, rotation(35*sine, vec3(1,0,0)));
        }
        left_leg = mult(left_leg, translation(0, -.24, 0));
        this.shapes.Man_Legs.draw( graphics_state, left_leg, this.black_clay);

        var right_leg = mult(body, translation(.45, -1.5, 0));
        if (continue2 == true && stop == false) {
          right_leg = mult(right_leg, rotation(-35*sine, vec3(1,0,0)));
        }
        right_leg = mult(right_leg, translation(0, -.24, 0));
        this.shapes.Man_Legs.draw( graphics_state, right_leg, this.black_clay);

        //lower legs
        var lower_left = mult(left_leg, translation(0, -.5, 0));
        if (continue2 == true && stop == false) {
          lower_left = mult(lower_left, rotation(-25*sine, vec3(1,0,0)));
        }
        lower_left = mult(lower_left, translation(0, -.35, 0));
        this.shapes.Lower_Legs.draw( graphics_state, lower_left, this.black_clay);

        var lower_right = mult(right_leg, translation(0, -.5, 0));
        if (continue2 == true && stop == false) {
          lower_right = mult(lower_right, rotation(25*sine, vec3(1,0,0)));
        }
        lower_right = mult(lower_right, translation(0, -.35, 0));
        this.shapes.Lower_Legs.draw( graphics_state, lower_right, this.black_clay);


        //feet
        var left_foot = mult(lower_left, translation(0, -.55, 0));
        if (continue2 == true && stop == false) {
          left_foot = mult(left_foot, rotation(20*left_feet(t), vec3(1,0,0)));
        }
        left_foot = mult(left_foot, translation(0, 0, .3));
        left_foot = mult(left_foot, scale(.35, .2, .6));
        this.shapes.good_sphere.draw( graphics_state, left_foot, this.greyPlastic);

        var right_foot = mult(lower_right, translation(0, -.55, 0));
        if (continue2 == true && stop == false) {
          right_foot = mult(right_foot, rotation(-20*right_feet(t), vec3(1,0,0)));
        }
        right_foot = mult(right_foot, translation(0, 0, .3));
        right_foot = mult(right_foot, scale(.35, .2, .6));
        this.shapes.good_sphere.draw( graphics_state, right_foot, this.greyPlastic);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




        //NATURE (World)
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var rock = mult(model_transform, translation(-34,-13.7,-18));
        rock = mult(rock, scale(1, .3, .7));

        for (let i = 0; i < 25; i++) {
          rock = mult(rock, translation(0,0,2));
          this.shapes.good_sphere.draw( graphics_state, rock, this.brown_clay);
        }


        rock = mult(rock, translation(11, 0, -41));

        for (let i = 0; i < 16; i++) {
          rock = mult(rock, translation(0,0,2));
          this.shapes.good_sphere.draw( graphics_state, rock, this.brown_clay);
        }

        if (bridge == true) {
          var rock = mult(model_transform, translation(-31.8, -13.7, .25));
          rock = mult(rock, scale(1, .3, .7));
          this.shapes.good_sphere.draw( graphics_state, rock, this.brown_clay);
          for (let i = 0; i < 4; i++) {
            rock = mult(rock, translation(2, 0, 0));
            this.shapes.good_sphere.draw( graphics_state, rock, this.brown_clay);
          }
          rock = mult(rock, translation(0, 0, -2));
          this.shapes.good_sphere.draw( graphics_state, rock, this.brown_clay);
          for (let i = 0; i < 4; i++) {
            rock = mult(rock, translation(-2, 0, 0));
            this.shapes.good_sphere.draw( graphics_state, rock, this.brown_clay);
          }

          rock = mult(rock, translation(0, 0, 4));
          this.shapes.good_sphere.draw( graphics_state, rock, this.brown_clay);
          for (let i = 0; i < 4; i++) {
            rock = mult(rock, translation(2, 0, 0));
            this.shapes.good_sphere.draw( graphics_state, rock, this.brown_clay);
          }
        }


        var stream_bed = mult(model_transform, translation(-28.5, -13.9, 0));
        stream_bed = mult(stream_bed, rotation(90, vec3(1,0,0)));
        stream_bed = mult(stream_bed, scale(5, 300, 1));
        this.shapes.strip.draw( graphics_state, stream_bed, this.stream_bed);

        for (let i = 0; i < 20; i++) {
          var waves = mult(model_transform, translation(-28.5, -13.8, -18));
          waves = mult(waves, rotation(90, vec3(1,0,0)));
          waves = mult(waves, scale(2, 1, 1));
          waves = mult(waves, translation(0, 3*i, 0));
          waves = mult(waves, rotation(25*sine1, vec3(1,0,0)));
          this.shapes.strip.draw( graphics_state, waves, this.waves);
        }

        for (let i = 0; i < 20; i++) {
          var waves = mult(model_transform, translation(-26, -13.8, -22));
          waves = mult(waves, rotation(90, vec3(1,0,0)));
          waves = mult(waves, scale(2, 1, 1));
          waves = mult(waves, translation(0, 3*i, 0));
          waves = mult(waves, rotation(25*sine2, vec3(1,0,0)));
          this.shapes.strip.draw( graphics_state, waves, this.waves);
        }

        for (let i = 0; i < 20; i++) {
          var waves = mult(model_transform, translation(-31, -13.8, -20));
          waves = mult(waves, rotation(90, vec3(1,0,0)));
          waves = mult(waves, scale(2, 1, 1));
          waves = mult(waves, translation(0, 3*i, 0));
          waves = mult(waves, rotation(25*sine, vec3(1,0,0)));
          this.shapes.strip.draw( graphics_state, waves, this.waves);
        }

        //Weeds
        var weed1 = mult(model_transform, translation(-10,0,-20));
        for (let i = 0; i < 20; i++) {
          weed1 = mult(weed1, translation(0,0,2));
          this.shapes.weed.draw( graphics_state, weed1, this.Weeds);
        }

        weed1 = mult(weed1, translation(9,0,-25));
        this.shapes.weed.draw( graphics_state, weed1, this.Weeds);
        if (bridge == false) {
          weed1 = mult(weed1, translation(3,0,5));
          this.shapes.weed.draw( graphics_state, weed1, this.Weeds);
        }

        var weed2 = mult(model_transform, translation(8,0,-20));

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      }
  }, Scene_Component );


//Movement functions for feet
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function left_feet(t, side) {

  var value = Math.sin(3*t);

  if (value > 0) {
    return 0;
  } else {
    return value;
  }
}

function right_feet(t, side) {

  var value = Math.sin(3*t);

  if (value > 0) {
    return value;
  } else {
    return 0;
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // ******************************************************************
  // The rest of this file is more code that powers the included demos.

Declare_Any_Class( "Debug_Screen",  // Debug_Screen - An example of a Scene_Component that our Canvas_Manager can manage.  Displays a text user interface.
  { 'construct'( context )
      { this.define_data_members( { string_map:    context.globals.string_map, start_index: 0, tick: 0, visible: false, graphics_state: new Graphics_State(),
                                    text_material: context.shaders_in_use["Phong_Model"].material(
                                                                                Color(  0, 0, 0, 1 ), 1, 0, 0, 40, context.textures_in_use["text.png"] ) } );
        var shapes = { 'debug_text': new Text_Line( 35 ),
                       'cube':   new Cube() };
        this.submit_shapes( context, shapes );
      },
    'init_keys'( controls )
      { controls.add( "t",    this, function() { this.visible ^= 1;                                                                                                  } );
        controls.add( "up",   this, function() { this.start_index = ( this.start_index + 1 ) % Object.keys( this.string_map ).length;                                } );
        controls.add( "down", this, function()
                                    { this.start_index = ( this.start_index - 1   + Object.keys( this.string_map ).length ) % Object.keys( this.string_map ).length; } );
        this.controls = controls;
      },
    'update_strings'( debug_screen_object )   // Strings that this Scene_Component contributes to the UI:
      { debug_screen_object.string_map["tick"]              = "Frame: " + this.tick++;
        debug_screen_object.string_map["text_scroll_index"] = "Text scroll index: " + this.start_index;
      },
    'display'( global_graphics_state )    // Leave these 3D global matrices unused, because this class is instead making a 2D user interface.
      { if( !this.visible ) return;
        var font_scale = scale( .02, .04, 1 ),
            model_transform = mult( translation( -.95, -.9, 0 ), font_scale ),
            strings = Object.keys( this.string_map );

        for( var i = 0, idx = this.start_index; i < 4 && i < strings.length; i++, idx = (idx + 1) % strings.length )
        { this.shapes.debug_text.set_string( this.string_map[ strings[idx] ] );
          this.shapes.debug_text.draw( this.graphics_state, model_transform, this.text_material );  // Draw some UI text (each live-updated
          model_transform = mult( translation( 0, .08, 0 ), model_transform );                      // logged value in each Scene_Component)
        }
        model_transform   = mult( translation( .7, .9, 0 ), font_scale );
        this.  shapes.debug_text.set_string( "Controls:" );
        this.  shapes.debug_text.draw( this.graphics_state, model_transform, this.text_material );  // Draw some UI text

        for( let k of Object.keys( this.controls.all_shortcuts ) )
        { model_transform = mult( translation( 0, -0.08, 0 ), model_transform );
          this.shapes.debug_text.set_string( k );
          this.shapes.debug_text.draw( this.graphics_state, model_transform, this.text_material );  // Draw some UI text (the canvas's key controls)
        }
      }
  }, Scene_Component );

Declare_Any_Class( "Example_Camera",                  // An example of a Scene_Component that our Canvas_Manager can manage.  Adds both first-person and
  { 'construct'( context, canvas = context.canvas )   // third-person style camera matrix controls to the canvas.
      { // 1st parameter below is our starting camera matrix.  2nd is the projection:  The matrix that determines how depth is treated.  It projects 3D points onto a plane.
        context.globals.graphics_state.set( translation(0, 0,-25), perspective(45, context.width/context.height, .1, 1000), 0 );
        this.define_data_members( { graphics_state: context.globals.graphics_state, thrust: vec3(), origin: vec3( 0, 5, 0 ), looking: false } );

        // *** Mouse controls: ***
        this.mouse = { "from_center": vec2() };                           // Measure mouse steering, for rotating the flyaround camera:
        var mouse_position = function( e ) { return vec2( e.clientX - context.width/2, e.clientY - context.height/2 ); };
        canvas.addEventListener( "mouseup",   ( function(self) { return function(e)
                                                                      { e = e || window.event;    self.mouse.anchor = undefined;              } } ) (this), false );
        canvas.addEventListener( "mousedown", ( function(self) { return function(e)
                                                                      { e = e || window.event;    self.mouse.anchor = mouse_position(e);      } } ) (this), false );
        canvas.addEventListener( "mousemove", ( function(self) { return function(e)
                                                                      { e = e || window.event;    self.mouse.from_center = mouse_position(e); } } ) (this), false );
        canvas.addEventListener( "mouseout",  ( function(self) { return function(e) { self.mouse.from_center = vec2(); }; } ) (this), false );  // Stop steering if the
      },                                                                                                                                        // mouse leaves the canvas.
    'init_keys'( controls )   // init_keys():  Define any extra keyboard shortcuts here
      { controls.add( "Space", this, function() { this.thrust[1] = -1; } );     controls.add( "Space", this, function() { this.thrust[1] =  0; }, {'type':'keyup'} );
        controls.add( "z",     this, function() { this.thrust[1] =  1; } );     controls.add( "z",     this, function() { this.thrust[1] =  0; }, {'type':'keyup'} );
        controls.add( "w",     this, function() { this.thrust[2] =  1; } );     controls.add( "w",     this, function() { this.thrust[2] =  0; }, {'type':'keyup'} );
        controls.add( "a",     this, function() { this.thrust[0] =  1; } );     controls.add( "a",     this, function() { this.thrust[0] =  0; }, {'type':'keyup'} );
        controls.add( "s",     this, function() { this.thrust[2] = -1; } );     controls.add( "s",     this, function() { this.thrust[2] =  0; }, {'type':'keyup'} );
        controls.add( "d",     this, function() { this.thrust[0] = -1; } );     controls.add( "d",     this, function() { this.thrust[0] =  0; }, {'type':'keyup'} );
        controls.add( ",",     this, function() { this.graphics_state.camera_transform = mult( rotation( 6, 0, 0,  1 ), this.graphics_state.camera_transform ); } );
        controls.add( ".",     this, function() { this.graphics_state.camera_transform = mult( rotation( 6, 0, 0, -1 ), this.graphics_state.camera_transform ); } );
        controls.add( "o",     this, function() { this.origin = mult_vec( inverse( this.graphics_state.camera_transform ), vec4(0,0,0,1) ).slice(0,3)         ; } );
        controls.add( "r",     this, function() { this.graphics_state.camera_transform = identity()                                                           ; } );
        controls.add( "f",     this, function() { this.looking  ^=  1; } );
        controls.add( "e",     this, function() { continue1 = true;    } );
        controls.add( "l",     this, function() { continue2 = true;    } );
        controls.add( "g",     this, function() { continue3 = true;    } );
        controls.add( "y",     this, function() { continue4 = true;    } );
      },
    'update_strings'( user_interface_string_manager )   // Strings that this Scene_Component contributes to the UI:
      { var C_inv = inverse( this.graphics_state.camera_transform ), pos = mult_vec( C_inv, vec4( 0, 0, 0, 1 ) ),
                                                                  z_axis = mult_vec( C_inv, vec4( 0, 0, 1, 0 ) );

        user_interface_string_manager.string_map["time" ] = "Frame Rate: " + 1/(this.graphics_state.animation_delta_time/1000) + " fps";

        user_interface_string_manager.string_map["origin" ] = "Center of rotation: "
                                                              + this.origin[0].toFixed(0) + ", " + this.origin[1].toFixed(0) + ", " + this.origin[2].toFixed(0);
        user_interface_string_manager.string_map["cam_pos"] = "Cam Position: "
                                                              + pos[0].toFixed(2) + ", " + pos[1].toFixed(2) + ", " + pos[2].toFixed(2);
        user_interface_string_manager.string_map["facing" ] = "Facing: " + ( ( z_axis[0] > 0 ? "West " : "East ")             // (Actually affected by the left hand rule)
                                                               + ( z_axis[1] > 0 ? "Down " : "Up " ) + ( z_axis[2] > 0 ? "North" : "South" ) );
      },
    'display'( graphics_state )
      { var leeway = 70,  degrees_per_frame = .0004 * graphics_state.animation_delta_time,
                          meters_per_frame  =   .01 * graphics_state.animation_delta_time;
        if( this.mouse.anchor )                                                         // Third-person "arcball" camera mode: Is a mouse drag occurring?
        { var dragging_vector = subtract( this.mouse.from_center, this.mouse.anchor );  // Spin the scene around the world origin on a user-determined axis.
          if( length( dragging_vector ) > 0 )
            graphics_state.camera_transform = mult( graphics_state.camera_transform,    // Post-multiply so we rotate the scene instead of the camera.
                mult( translation( this.origin ),
                mult( rotation( .05 * length( dragging_vector ), dragging_vector[1], dragging_vector[0], 0 ),
                      translation(scale_vec( -1, this.origin ) ) ) ) );
        }
        // First-person flyaround mode:  Determine camera rotation movement when the mouse is past a minimum distance (leeway) from the canvas's center.
        var offsets = { plus:  [ this.mouse.from_center[0] + leeway, this.mouse.from_center[1] + leeway ],
                        minus: [ this.mouse.from_center[0] - leeway, this.mouse.from_center[1] - leeway ] };
        if( this.looking )
          for( var i = 0; i < 2; i++ )      // Steer according to "mouse_from_center" vector, but don't start increasing until outside a leeway window from the center.
          { var velocity = ( ( offsets.minus[i] > 0 && offsets.minus[i] ) || ( offsets.plus[i] < 0 && offsets.plus[i] ) ) * degrees_per_frame;  // &&'s might zero these out.
            graphics_state.camera_transform = mult( rotation( velocity, i, 1-i, 0 ), graphics_state.camera_transform );   // On X step, rotate around Y axis, and vice versa.
          }     // Now apply translation movement of the camera, in the newest local coordinate frame
        graphics_state.camera_transform = mult( translation( scale_vec( meters_per_frame, this.thrust ) ), graphics_state.camera_transform );
      }
  }, Scene_Component );

Declare_Any_Class( "Flag_Toggler",  // A class that just interacts with the keyboard and reports strings
  { 'construct'( context ) { this.globals    = context.globals; },
    'init_keys'( controls )   //  Desired keyboard shortcuts
      { controls.add( "ALT+g", this, function() { this.globals.graphics_state.gouraud       ^= 1; } );   // Make the keyboard toggle some
        controls.add( "ALT+n", this, function() { this.globals.graphics_state.color_normals ^= 1; } );   // GPU flags on and off.
        controls.add( "ALT+a", this, function() { this.globals.animate                      ^= 1; } );
      },
    'update_strings'( user_interface_string_manager )   // Strings that this Scene_Component contributes to the UI:
      { user_interface_string_manager.string_map["time"]    = "Animation Time: " + Math.round( this.globals.graphics_state.animation_time )/1000 + "s";
        user_interface_string_manager.string_map["animate"] = "Animation " + (this.globals.animate ? "on" : "off") ;
      },
  }, Scene_Component );

Declare_Any_Class( "Surfaces_Tester",
  { 'construct'( context )
      { context.globals.animate = true;
        var shapes = { 'good_sphere' : new Subdivision_Sphere( 4 ),
                       'box'         : new Cube(),
                       'strip'       : new Square(),
                       'septagon'    : new Regular_2D_Polygon(  2,  7 ),
                       'tube'        : new Cylindrical_Tube  ( 10, 10 ),
                       'open_cone'   : new Cone_Tip          (  3, 10 ),
                       'donut'       : new Torus             ( 15, 15 ),
                       'bad_sphere'  : new Grid_Sphere       ( 10, 10 ),
                       'cone'        : new Closed_Cone       ( 10, 10 ),
                       'capped'      : new Capped_Cylinder   (  4, 12 ),
                       'axis'        : new Axis_Arrows(),
                       'prism'       :     Capped_Cylinder   .prototype.auto_flat_shaded_version( 10, 10 ),
                       'gem'         :     Subdivision_Sphere.prototype.auto_flat_shaded_version(  2     ),
                       'gem2'        :     Torus             .prototype.auto_flat_shaded_version( 20, 20 ),
                       'swept_curve' : new Surface_Of_Revolution( 10, 10,
                                            [ vec3( 2, 0, -1 ), vec3( 1, 0, 0 ), vec3( 1, 0, 1 ), vec3( 0, 0, 2 ) ], 120, [ [ 0, 7 ] [ 0, 7 ] ] )
                     };
        this.submit_shapes( context, shapes );
        this.define_data_members( { shader: context.shaders_in_use["Phong_Model"], textures: Object.values( context.textures_in_use ) } );
      },
    'draw_all_shapes'( model_transform, graphics_state )
      { var i = 0, t = graphics_state.animation_time / 1000;

        for( key in this.shapes )
        { i++;
          var funny_function_of_time = 50*t + i*i*Math.cos( t/2 ),
              random_material        = this.shader.material( Color( (i % 7)/7, (i % 6)/6, (i % 5)/5, 1 ), .2, 1, 1, 40, this.textures[ i % this.textures.length ] )

          model_transform = mult( model_transform, rotation( funny_function_of_time, i%3 == 0, i%3 == 1, i%3 == 2 ) );   // Irregular motion
          model_transform = mult( model_transform, translation( 0, -3, 0 ) );
          this.shapes[ key ].draw( graphics_state, model_transform, random_material );        //  Draw the current shape in the list
        }
        return model_transform;
      },
    'display'( graphics_state )
      { var model_transform = identity();
        for( var i = 0; i < 7; i++ )                                    // Another example of not every shape owning the same pair of lights:
        { graphics_state.lights = [ new Light( vec4( i % 7 - 3, i % 6 - 3, i % 5 - 3, 1 ), Color( 1, 0, 0, 1 ), 100000000 ),
                                    new Light( vec4( i % 6 - 3, i % 5 - 3, i % 7 - 3, 1 ), Color( 0, 1, 0, 1 ), 100000000 ) ];

          model_transform = this.draw_all_shapes( model_transform, graphics_state );      // *** How to call a function and still have a single matrix state ***
          model_transform = mult( model_transform, rotation( 360 / 13, 0, 0, 1 ) );
        }
      }
  }, Scene_Component );

Declare_Any_Class( "Star",    // An example of animating without making any extremely customized primitives.
  { 'construct'( context )    // Each frame manages to show one million points connected by half as many flat-colored triangles.
      { context.globals.animate = true;
        context.globals.graphics_state.animation_time = 90000;
        this.shader = context.shaders_in_use["Phong_Model"];
        var shapes = { "torus": Torus.prototype.auto_flat_shaded_version( 25, 25 ) };
        shapes.torus.indexed = false;             // Just to additionally test non-indexed shapes somewhere, use the fact that in this
        this.submit_shapes( context, shapes );    // flat-shaded shape (no shared vertices) the index list is redundant.
      },
    'display'( graphics_state )
      { var t = graphics_state.animation_time/500,   funny_orbit = rotation(  90*t, [ Math.cos(t), Math.sin(t), .7*Math.cos(t) ] );
        graphics_state.lights = [ new Light( mult_vec( funny_orbit, vec4(  30,  30,  34, 1 ) ), Color( 0, .4, 0, 1 ), 100000               ),
                                  new Light( mult_vec( funny_orbit, vec4( -10, -20, -14, 0 ) ), Color( 1, 1, .3, 1 ), 100*Math.cos( t/10 ) ) ];
        for( var j = 0; j < 20; j++ )
          for( var i = 0; i < 20; i++ )
          {
            var model_transform =                        rotation   ( j * 18 *                  t/60  , 0, 0, 1   );
                model_transform = mult( model_transform, rotation   ( i * 18 * Math.sin(        t/21 ), 0, 1, 0 ) );
                model_transform = mult( model_transform, translation( 2 * i  * Math.sin(        t/31 ), 0, 0    ) );
                model_transform = mult( model_transform, scale      ( 1,  1  + Math.sin( i*18 * t/41 ), 1       ) );

            this.shapes.torus.draw( graphics_state, model_transform, this.shader.material( Color( i/10, j/20, 0, 1 ), .2, .8, .5, 20 ) );
          }
      }
  }, Scene_Component );

Declare_Any_Class( "Bump_Map_And_Mesh_Loader",     // An example where one teapot has a bump-mapping-like hack, and the other does not.
  { 'construct'( context )
      { context.globals.animate = true;
        context.globals.graphics_state.camera_transform = translation( 0, 0, -5 );

        var shapes = { "teapot": new Shape_From_File( "teapot.obj" ) };
        this.submit_shapes( context, shapes );
        this.define_data_members( { stars: context.shaders_in_use["Phong_Model"  ].material( Color( .5,.5,.5,1 ), .5, .5, .5, 40, context.textures_in_use["stars.png"] ),
                                    bumps: context.shaders_in_use["Fake_Bump_Map"].material( Color( .5,.5,.5,1 ), .5, .5, .5, 40, context.textures_in_use["stars.png"] )});
      },
    'display'( graphics_state )
      { var t = graphics_state.animation_time;

        graphics_state.camera_transform = translation( 0, 0, -5 );
        graphics_state.lights = [ new Light( mult_vec( rotation( t/5, 1, 0, 0 ), vec4(  3,  2,  10, 1 ) ), Color( 1, .7, .7, 1 ), 100000 ) ];

        for( let i of [ -1, 1 ] )
        { var model_transform = mult( rotation( t/40, 0, 2, 1 ), translation( 2*i, 0, 0 ) );
              model_transform = mult( model_transform, rotation( t/25, -1, 2, 0 ) );
          this.shapes.teapot.draw( graphics_state, mult( model_transform, rotation( -90, 1, 0, 0 ) ), i == 1 ? this.stars : this.bumps );
        }
      }
  }, Scene_Component );


  // DISCLAIMER:  The collision method shown below is not used by anyone; it's just very quick to code.  Making every collision body a stretched sphere is kind
  // of a hack, and looping through a list of discrete sphere points to see if the volumes intersect is *really* a hack (there are perfectly good analytic
  // expressions that can test if two ellipsoids intersect without discretizing them into points).   On the other hand, for non-convex shapes you're usually going
  // to have to loop through a list of discrete tetrahedrons defining the shape anyway.
Declare_Any_Class( "Body",
  { 'construct'(s, m) { this.randomize(s, m); },
    'randomize'(s, m)
      { this.define_data_members( { shape: s, scale: [1, 1+Math.random(), 1],
                                    location_matrix: mult( rotation( 360 * Math.random(), random_vec3(1) ), translation( random_vec3(10) ) ),
                                    linear_velocity: random_vec3(.1),
                                    angular_velocity: .5*Math.random(), spin_axis: random_vec3(1),
                                    material: m } )
      },
    'advance'( b, time_amount )   // Do one timestep.
      { var delta = translation( scale_vec( time_amount, b.linear_velocity ) );  // Move proportionally to real time.
        b.location_matrix = mult( delta, b.location_matrix );                    // Apply translation velocity - pre-multiply to keep translations together

        delta = rotation( time_amount * b.angular_velocity, b.spin_axis );       // Move proportionally to real time.
        b.location_matrix = mult( b.location_matrix, delta );                    // Apply angular velocity - post-multiply to keep rotations together
      },
    'check_if_colliding'( b, a_inv, shape )   // Collision detection function
      { if ( this == b ) return false;        // Nothing collides with itself
        var T = mult( a_inv, mult( b.location_matrix, scale( b.scale ) ) );  // Convert sphere b to a coordinate frame where a is a unit sphere
        for( let p of shape.positions )                                      // For each vertex in that b,
        { var Tp = mult_vec( T, p.concat(1) ).slice(0,3);                    // Apply a_inv*b coordinate frame shift
          if( dot( Tp, Tp ) < 1.2 )   return true;     // Check if in that coordinate frame it penetrates the unit sphere at the origin.
        }
        return false;
      }
  });

Declare_Any_Class( "Simulation_Scene_Superclass",
  { 'construct'( context )
      { context.globals.animate = true;
        this.define_data_members( { bodies: [], shader: context.shaders_in_use["Phong_Model"], stars: context.textures_in_use["stars.png"] } );

        var shapes = { "donut"       : new Torus( 15, 15 ),
                       "cone"        : new Closed_Cone( 10, 10 ),
                       "capped"      : new Capped_Cylinder( 4, 12 ),
                       "axis"        : new Axis_Arrows(),
                       "prism"       :     Capped_Cylinder   .prototype.auto_flat_shaded_version( 10, 10 ),
                       "gem"         :     Subdivision_Sphere.prototype.auto_flat_shaded_version( 2 ),
                       "gem2"        :     Torus             .prototype.auto_flat_shaded_version( 20, 20 ) };
        this.submit_shapes( context, shapes );
      },
    'random_shape'() { return Object.values( this.shapes )[ Math.floor( 7*Math.random() ) ] },
    'random_material'() { return this.shader.material( Color( 1,Math.random(),Math.random(),1 ), .1, 1, 1, 40, this.stars ) },
    'display'( graphics_state )
      { graphics_state.lights = [ new Light( vec4(5,1,1,0), Color( 1, 1, 1, 1 ), 10000 ) ];

        if( Math.random() < .02 ) this.bodies.splice( 0, this.bodies.length/4 ); // Sometimes we delete some so they can re-generate as new ones
        for( let b of this.bodies )
        { b.shape.draw( graphics_state, mult( b.location_matrix, scale( b.scale ) ), b.material ); // Draw each shape at its current location
          b.advance( b, graphics_state.animation_delta_time );
        }
        this.simulate();    // This is an abstract class; call the subclass's version
      },
  }, Scene_Component );

Declare_Any_Class( "Ground_Collision_Scene",    // Scenario 1: Let random initial momentums carry bodies until they fall and bounce.
  { 'simulate'()
      { while( this.bodies.length < 100 )   this.bodies.push( new Body(this.random_shape(), this.random_material()) );      // Generate moving bodies
        for( let b of this.bodies )
        { b.linear_velocity[1] += .0001 * -9.8;       // Gravity.
          if( b.location_matrix[1][3] < -4 && b.linear_velocity[1] < 0 ) b.linear_velocity[1] *= -.8;   // If about to fall through floor, reverse y velocity.
        }
      }
  }, Simulation_Scene_Superclass );

Declare_Any_Class( "Object_Collision_Scene",    // Scenario 2: Detect when some flying objects collide with one another, coloring them red.
  { 'simulate'()
      { if   ( this.bodies.length > 20 )       this.bodies = this.bodies.splice( 0, 20 );                                   // Max of 20 bodies
        while( this.bodies.length < 20 )       this.bodies.push( new Body(this.random_shape(), this.random_material()) );   // Generate moving bodies

        if( ! this.collider ) this.collider = new Subdivision_Sphere(1);      // The collision shape should be simple

        for( let b of this.bodies )
        { var b_inv = inverse( mult( b.location_matrix, scale( b.scale ) ) );               // Cache b's final transform

          var center = mult_vec( b.location_matrix, vec4( 0, 0, 0, 1 ) ).slice(0,3);        // Center of the body
          b.linear_velocity = subtract( b.linear_velocity, scale_vec( .0003, center ) );    // Apply a small centripetal force to everything
          b.material = this.shader.material( Color( 1,1,1,1 ), .1, 1, 1, 40, this.stars );              // Default color: white

          for( let c of this.bodies )                                      // Collision process starts here
            if( b.check_if_colliding( c, b_inv, this.collider ) )          // Send the two bodies and the collision shape
            { b.material = this.shader.material( Color( 1,0,0,1 ), .1, 1, 1, 40, this.stars );        // If we get here, we collided, so turn red
              b.linear_velocity  = vec3();                                 // Zero out the velocity so they don't inter-penetrate more
              b.angular_velocity = 0;
            }
        }
      }
  }, Simulation_Scene_Superclass );
