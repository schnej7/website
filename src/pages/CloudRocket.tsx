/*
 * Note:
 *   This code was ported from a 24hr game jam
 *   I do not condone the code in this file, nor do I consider it production quality
 */

import './cloudRocket/CloudRocket.scss';
import React, { useState } from "react";

const new_obj_limit = 1400;
const new_puff_limit = 8;
const puff_max_age = new_puff_limit * 10;
const MAX_VX = 20;
const COLORS=["#FFBF00","#E83F6F","#2274A5","#32936F","#581D68"];
const CLOUDS=[
  [{"x":439,"y":203},{"x":437,"y":182},{"x":440,"y":162},{"x":450,"y":142},{"x":471,"y":135},{"x":491,"y":130},{"x":513,"y":125},{"x":533,"y":127},{"x":544,"y":146},{"x":549,"y":167},{"x":549,"y":188},{"x":549,"y":209},{"x":539,"y":227},{"x":519,"y":238},{"x":499,"y":238},{"x":477,"y":238}],
  [{"x":681,"y":134},{"x":700,"y":143},{"x":714,"y":158},{"x":722,"y":178},{"x":728,"y":198},{"x":719,"y":217},{"x":702,"y":231},{"x":683,"y":239},{"x":663,"y":243},{"x":640,"y":240},{"x":623,"y":228},{"x":610,"y":211},{"x":606,"y":191},{"x":606,"y":170},{"x":613,"y":149},{"x":629,"y":132}],
  [{"x":989,"y":145},{"x":1008,"y":152},{"x":1021,"y":168},{"x":1030,"y":186},{"x":1041,"y":204},{"x":1042,"y":224},{"x":1028,"y":239},{"x":1008,"y":247},{"x":988,"y":252},{"x":968,"y":253},{"x":947,"y":253},{"x":926,"y":250},{"x":908,"y":237},{"x":903,"y":213},{"x":905,"y":193},{"x":918,"y":176},{"x":937,"y":158}],
  [{"x":490,"y":234},{"x":472,"y":224},{"x":456,"y":211},{"x":442,"y":194},{"x":437,"y":173},{"x":440,"y":152},{"x":455,"y":135},{"x":475,"y":127},{"x":498,"y":126},{"x":518,"y":132},{"x":528,"y":156},{"x":530,"y":176},{"x":537,"y":198},{"x":537,"y":218}]
];
const scales = [0.999, 0.998, 0.997, 0.996, 0.995];
const cloud_nerf_limit = 100000;

let vx = 0;
let vy = 10;
let thrust = 1.4;
let angle = 90;
let INDICATOR_SPEED = 10;
let pressedKeys = {};
let abs_x;
let abs_y;
let max_y;
let screen_height;
let screen_width;
let new_obj_count = 0;
let next_obj_limit = new_obj_limit;
let new_puff_count = 0;
let next_cloud_x;
let triangle;
let indicator_group;
let scaleIndex = 0;
let in_a_row = 0;
let max_in_a_row = 0;
let total_popped = 0;
let indicator;

const numberWithCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// Returns a random number between min (inclusive) and max (exclusive)
const randInt = (min, max) => Math.floor(Math.random() * (max-min)) + min;

const degToRad = (angle) => angle * (Math.PI / 180);

const hexToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const hexToColor = ( hex ) => {
  const color = hexToRgb( hex );
  return new Color(color.r/255,color.g/255,color.b/255);
}

const center = () => ({ x: screen_width / 2, y: screen_height / 2 });

const getScoreString = () =>
  [
    max_in_a_row ? numberWithCommas(max_in_a_row) + "&nbsp(longest&nbsprun)" : "XXX",
    total_popped ? numberWithCommas(total_popped) + "&nbsp(clouds)" : " XXX ",
    Math.floor(max_y) ? numberWithCommas(Math.floor(max_y)) + "&nbsp(altitude)" : " XXX ",
  ].join(" * ")
  + " = <b>" + numberWithCommas(getScore()) + "</b>";

const getScore = () => Math.floor(max_y) * (max_in_a_row || 1) * (total_popped || 1);

const initIndicator = () => {
  const triangle = new Path();
  triangle.add(
    new Point(next_cloud_x, 0),
    new Point(next_cloud_x + 10, 35),
    new Point(next_cloud_x - 10 ,35),
  );
  triangle.closePath();
  triangle.fillColor = hexToColor(COLORS[1]);
  triangle.onFrame = function() {
    INDICATOR_SPEED = Math.abs(this.position.x - next_cloud_x) / 4;
    if (next_cloud_x > this.position.x) {
      this.position.x += INDICATOR_SPEED;
    } else {
      this.position.x -= INDICATOR_SPEED;
    }
    if (Math.abs(next_cloud_x - this.position.x) < INDICATOR_SPEED + 1) {
      this.position.x = next_cloud_x;
    }
    const path = new Path.Rectangle({
      point: [ this.position.x - 10, 0],
      size: [20, Math.min(50, 50 * (1 - new_obj_count / next_obj_limit))],
      fillColor: 'black'
    });
    this.fitBounds(path.bounds);
    path.remove();
  }
  return triangle;
}

const onGameFrame = () => {
  const translation = new Point(vx, 0);
  triangle.obj.translate(translation);
  triangle.obj.position.x = (triangle.obj.position.x + screen_width) % screen_width;
  abs_x = (abs_x + vx + screen_width) % screen_width;
  abs_y = abs_y + vy;
  if (cloud_nerf_limit < abs_y && !$('#myCanvas.black').length) {
    $('#myCanvas').addClass('black');
    $('.score').addClass('white-text');
    $('.finalScore').addClass('white-text');
    triangle.obj.fillColor = '#000';
    triangle.obj.strokeColor= '#fff';
  }
  if (abs_y > max_y) {
    new_obj_count += abs_y - max_y;
    max_y = abs_y;
    if (new_obj_count > next_obj_limit) {
      next_obj_limit = Math.max(new_obj_limit, abs_y / (cloud_nerf_limit / new_obj_limit));
      const cloud_max = 70 * ((cloud_nerf_limit - abs_y) / cloud_nerf_limit);
      const cloud_min = 30;
      const cloud_size = Math.max(30, cloud_max);
      initCloud(next_cloud_x, -cloud_size, cloud_size);
      const next_x_min = Math.floor(Math.max(0, triangle.obj.position.x - abs_y / 60));
      const next_x_max = Math.floor(Math.min(screen_width, triangle.obj.position.x + abs_y / 50));
      next_cloud_x = randInt(next_x_min, next_x_max);
      new_obj_count = 0;
    }
  }
  new_puff_count += 1;
  if (new_puff_count > new_puff_limit) {
    initPuff();
    new_puff_count = 0;
  }
  vy += Math.sin(degToRad(angle)) * thrust / 5;
  vx = Math.max(Math.min(vx - (Math.cos(degToRad(angle)) * thrust * 2), MAX_VX), -MAX_VX);
  thrust = Math.max(thrust - 0.05, 0.04);
  vy -= 0.013;
}

const updateObject = (obj) => obj.translate(new Point(0, vy));

const fadeObject = (obj, age) => {
  if (obj.strokeColor) {
    obj.strokeColor.alpha /= 1.05;
  }
  if (obj.fillColor) {
    obj.fillColor.alpha /= 1.02;
  }
  obj.age = obj.age ? obj.age + 1 : 1;
  if (obj.age > age) {
    obj.remove();
  }
}

const fadeAndScaleObject = (obj, age) => {
  obj.scale(1.03);
  fadeObject(obj, age);
}

const spinAndScaleObject = (obj) => {
  obj.rotate(1);
  obj.scale(scales[scaleIndex]);
}

const initTriangle = () => {
  const triangle = new Path();
  triangle.add(
    new Point(center().x, center().y),
    new Point(center().x + 10, center().y + 22),
    new Point(center().x - 10, center().y + 22),
  );
  triangle.closePath();
  triangle.strokeColor = '#000';
  triangle.fillColor = '#fff';
  abs_x = triangle.position.x;
  abs_y = 0;
  max_y = abs_y;
  triangle.sendToBack();
  return {
    "obj": triangle,
    "turn": function(deg) {
      this.obj.rotate(deg);
      angle = (angle + deg + 360) % 360;
    }
  };
}

const initCloud = (x, y, size) => {
  const cloud = new Path();
  const cloud_points = CLOUDS[randInt(0,CLOUDS.length)];
  const start_point = cloud_points[0];
  cloud.add(start_point.x, start_point.y);
  for (let i = 0; i < cloud_points.length; i++) {
    if (randInt(0, 100) < 99) {
      const point = cloud_points[i];
      cloud.arcTo(new Point(point.x, point.y));
    }
  }
  cloud.arcTo(new Point(start_point.x, start_point.y));
  cloud.closePath();
  cloud.position.x = x;
  cloud.position.y = -120;
  if (cloud_nerf_limit < abs_y) {
    cloud.strokeColor = '#fff';
    cloud.fillColor = '#000';
  } else {
    cloud.strokeColor = '#000';
    cloud.fillColor = '#fff';
  }
  cloud.onFrame = function(event) {
    updateObject(this);
    spinAndScaleObject(this);
    if (!this.hit && this.intersects(triangle.obj)) {
      this.hit = true;
      initBurst();
      in_a_row++;
      max_in_a_row = Math.max(max_in_a_row,in_a_row);
      total_popped += 1;
      thrust += 1;
      const color = COLORS[in_a_row%COLORS.length];
      this.strokeColor = hexToColor(color);
      const iar = $("<div/>",{
          class:'in_a_row',
          text:in_a_row
      });
      iar.css("color", color);
      $('.in_a_row_box').append(iar);
      setTimeout(function(){
        iar.addClass('fading');
      }, 1000);
      setTimeout(function(){
        iar.remove();
      }, 2000);
      indicator.fillColor = hexToColor(color);
    }
    if (this.hit) {
      if (this.strokeColor.alpha == 1) {
        this.strokeColor=hexToColor(COLORS[randInt(0, COLORS.length)]);
      }
      fadeAndScaleObject(this, puff_max_age);
    }
    if (!this.hit && this.position.y > triangle.obj.position.y + screen_height / 1.5) {
      in_a_row = 0;
      indicator.fillColor = hexToColor(COLORS[1]);
      this.remove();
    }
  }
  return cloud;
}

const initPuff = () => {
  const puff = new Path.Circle(
    new Point(
      triangle.obj.position.x + Math.cos(degToRad(angle)) * (20 + thrust * 10),
      triangle.obj.position.y + Math.sin(degToRad(angle)) * (10 + thrust * 10),
    ),
    4 + thrust * 40,
  );

  puff.strokeWidth = Math.floor(1.9 + thrust);
  if (cloud_nerf_limit < abs_y) {
    puff.strokeColor = '#fff';
    puff.fillColor = '#000';
  } else {
    puff.strokeColor = '#000';
    puff.fillColor = '#fff';
  }
  puff.onFrame = function(event) {
    updateObject(this);
    fadeAndScaleObject(this, puff_max_age);
  }
  puff.sendToBack();
  return puff;
}

const initBurst = () => {
  for (let i = 0; i < 10; i++) {
    const dx = randInt(-5, 5);
    const dy = randInt(-5, 6) || 1;
    const ptc = new Path.Circle(
      new Point(
        triangle.obj.position.x + dx,
        triangle.obj.position.y + dy,
      ),
      randInt(2, 3),
    );

    ptc.fillColor = hexToColor(COLORS[randInt(0, COLORS.length)]);
    ptc.dx = dx;
    ptc.dy = dy;
    ptc.onFrame = function(event) {
      this.translate(new Point(vx + this.dx, this.dy));
      fadeObject(this, 80);
    }
  }
}

class CloudRocket extends React.Component {

  loaded: false;

  addScript(src) {
    const script = document.createElement("script");
    script.src = src;
    document.body.appendChild(script);
  }

  componentDidMount() {
    if (this.loaded) return;

    this.addScript("/js/cloud-rocket/paper-full.min.js");
    this.addScript("/js/cloud-rocket/jquery.js");

    // TODO: fix this timeout, should run after scripts load rather than hard coded delay
    setTimeout(() => {
      screen_height = $(window).height();
      screen_width = $(window).width();
      next_cloud_x = screen_width/2;

      const canvasElem = $('#myCanvas').get(0);
      canvasElem.setAttribute('height', $(window).height());
      canvasElem.setAttribute('width', $(window).width());

      paper.install(window);
      paper.setup('myCanvas');

      const paths = [],
        increasingScales = [];

      let start;

      for (let i = 0; i < scales.length; i++) {
        increasingScales.push(scales[scales.length - 1 - i]);
      }
      for (let i = 0; i < increasingScales.length; i++) {
        scales.push(increasingScales[i]);
      }
      const reverseScales = [];
      for (let i = 0; i < scales.length; i++) {
        reverseScales.push(1 / scales[scales.length - 1 - i]);
      }
      for (let i = 0; i < reverseScales.length; i++) {
        scales.push(reverseScales[i]);
      }

      const tool2 = new Tool();
      tool2.minDistance = 20;

      const points = [];
      tool2.onMouseDrag = function(event) {
        if (event.point.getDistance(start) < 19) {
          paths[paths.length - 1].arcTo(start);
        } else {
          paths[paths.length - 1].arcTo(event.point);
          points.push(JSON.stringify({ x: event.point.x, y: event.point.y }));
        }
      }

      view.onFrame = function(event) {
        // On each frame, rotate the path by 3 degrees:
        scaleIndex = (scaleIndex + 1) % scales.length;
        for (let i = 0; i < paths.length; i++) {
          const path = paths[i];
          if (path) {
            path.rotate(3);
            path.scale(scales[scaleIndex]);
          }
        }

        if (pressedKeys["right"]) {
          triangle.turn(5);
        }
        if (pressedKeys["left"]) {
          triangle.turn(-5);
        }

        onGameFrame();

        if (abs_y < 0 || vy < -2) {
          view.onFrame = null;
          const bestScore = localStorage.bestScore || 0;
          if (bestScore < getScore()) {
            localStorage.bestScore = getScore();
            localStorage.bestScoreString = getScoreString();
          }
          in_a_row = 0;
          abs_y = 0;
          $(".finalScore").removeClass("hidden");
          $(".finalScore .getScoreString").html(getScoreString());
          $(".finalScore .runString").html(max_in_a_row);
          $(".finalScore .bestScoreString").html(localStorage.bestScoreString);
        }
        $(".score").html(getScoreString());
      }

      triangle = initTriangle();
      tool2.onKeyDown = function(event) {
        pressedKeys[event.key] = true;
      }

      tool2.onKeyUp = function(event) {
        pressedKeys[event.key] = false;
      }

      indicator = initIndicator();
    }, 100);
    this.loaded = true;
  }

  render() {
    return (
      <>
        <div className="gameArea">
          <canvas id="myCanvas" height="600" width="1000" />
          <div className="debug" />
          <div className="in_a_row_box shadow" />
          <div className="score" />
          <div className="finalScore hidden shadow">
						Score:
						<span className="getScoreString" />
            <br />
						Best:
						<span className="bestScoreString" />
          </div>
        </div>
      </>
    )
  }
}

export default CloudRocket
