(function (Facade) {

    'use strict';

    function displayErrorMessage (msg) {

        if (window.console !== undefined && window.console.error !== undefined) {

            console.error('Facade.js Box2D Plugin -', msg);

        }

    }

    var methods = {

        createObject: function (world, config) {

            var body = new Box2D.Dynamics.b2BodyDef(),
                fixture = new Box2D.Dynamics.b2FixtureDef(),
                options = this._configOptions(this.getAllOptions()),
                metrics = this.getAllMetrics(),
                vertices = [],
                key,
                defaults = {
                    type: 'static',
                    fixedRotation: false,
                    density: 1.0,
                    friction: 0.5,
                    restitution: 0.5,
                    scale: 30
                };

            if (config === undefined) {

                config = {};

            }

            Object.keys(defaults).forEach(function (key) {

                if (config[key] === undefined) {

                    config[key] = defaults[key];

                }

            });

            if (config.type === 'dynamic') {

                body.type = Box2D.Dynamics.b2Body.b2_dynamicBody;

            } else if (config.type === 'kinematic') {

                body.type = Box2D.Dynamics.b2Body.b2_kinematicBody;

            } else {

                body.type = Box2D.Dynamics.b2Body.b2_staticBody;

            }

            body.fixedRotation = config.fixedRotation;
            body.angle = options.rotate * (Math.PI / 180);

            body.position = new Box2D.Common.Math.b2Vec2(
                metrics.x / config.scale,
                metrics.y / config.scale
            );

            for (key in options.points) {

                if (options.points[key] !== undefined) {

                    vertices.push(new Box2D.Common.Math.b2Vec2(
                        (options.points[key][0] / config.scale),
                        options.points[key][1] / config.scale)
                    );

                }

            }

            fixture.density = config.density;
            fixture.friction = config.friction;
            fixture.restitution = config.restitution;

            fixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
            fixture.shape.SetAsArray(vertices, options.points.length);

            world.CreateBody(body).CreateFixture(fixture);

            if (this._box2d !== undefined) {

                methods.destroyObject.call(this, world);

            }

            this._box2d = {
                entity: world.GetBodyList(),
                config: config
            };

            return this;

        },

        destroyObject: function (world) {

            if (this._box2d !== undefined) {

                world.DestroyBody(this._box2d.entity);

                delete this._box2d;

            }

        },

        getCurrentState: function () {

            if (this._box2d !== undefined) {

                return {
                    x: this._box2d.entity.GetPosition().x * this._box2d.config.scale,
                    y: this._box2d.entity.GetPosition().y * this._box2d.config.scale,
                    rotate: this._box2d.entity.GetAngle() * (180 / Math.PI)
                };

            }

        },

        getPosition: function () {



        },

        getVelocity: function () {

            if (this._box2d !== undefined) {

                return {
                    x: this._box2d.entity.m_linearVelocity.x,
                    y: this._box2d.entity.m_linearVelocity.y
                };

            }

        },

        setPosition: function (x, y) {



        },

        setVelocity: function (x, y) {

            if (this._box2d !== undefined) {

                if (x === undefined) {

                    x = 0;

                }

                if (y === undefined) {

                    y = 0;

                }

                this._box2d.entity.SetLinearVelocity(
                    new Box2D.Common.Math.b2Vec2(x, y),
                    this._box2d.entity.GetWorldCenter()
                );

            }

        }

    };

    Facade.Entity.prototype.Box2D = function (method) {

        if (methods[method]) {

            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

        } else {

            displayErrorMessage(method + ' is not a method specified in this plugin.');

        }

    };

}(Facade));
