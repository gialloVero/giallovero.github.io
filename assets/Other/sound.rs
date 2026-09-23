use crate::prelude::*;

#[cfg(feature = "client")]
pub(super) mod client_only {
    use bevy::audio::SpatialScale;
    use bevy_tnua::prelude::*;
    use bevy_tnua::builtins::TnuaBuiltinJumpState;
    use rand::prelude::*;
    use bevy::color::palettes::basic;

    use super::*;

    const SPATIAL_SCALE_VALUE : f32 = 0.05;
    const SPATIAL_SCALE : SpatialScale = SpatialScale::new(SPATIAL_SCALE_VALUE);

    pub fn plugin(app: &mut App) {
        app.add_systems(FixedUpdate, player_jump_observer);

        app.add_observer(spawn_foundation_observer);
        app.add_observer(spawn_ambience_observer);
        app.add_observer(spawn_chassis_observer);
        app.add_observer(spawn_wall_observer);
        app.add_observer(spawn_ping_observer);
        app.add_observer(spawn_server_observer);
        app.add_observer(spawn_music_observer);
        app.add_observer(sound_setup);
    }

    fn make_sound_gizmo() -> GizmoAsset {
        let mut gizmo = GizmoAsset::default();
        gizmo
            .sphere(Isometry3d::default(), 1., basic::YELLOW)
            .resolution(4);

        gizmo
    }

    fn sound_setup(
        trigger: Trigger<OnAdd, ThirdPersonCameraComponent>,
        asset_server: Res<AssetServer>,
        mut commands:Commands,

    ) {
        //space between two ears
        let gap = -5.0;
        let listener = SpatialListener::new(gap);
        let parent_entity = trigger.target();
        let listener_entity = commands.spawn((
        Transform::default(),
        listener,
        )).id();

        commands.entity(parent_entity).add_child(listener_entity);
    }

    //TODO: (Giorgio) use something better than the camera component
    fn spawn_ambience_observer(
        trigger: Trigger<OnAdd, ThirdPersonCameraComponent>,
        mut commands: Commands,
        asset_server: Res<AssetServer>,
    ) {
        let sound_effect: Handle<AudioSource> = asset_server.load("audio/sfx/WindLooping.ogg");
        commands.spawn((
            AudioPlayer(sound_effect),
            PlaybackSettings::LOOP,));
    }

    fn spawn_wall_observer(
        trigger: Trigger<OnAdd, WallComponent>,
        mut commands: Commands,
        asset_server: Res<AssetServer>,
        mut gizmo_assets: ResMut<Assets<GizmoAsset>>,
        toggles: Res<DebugTogglesResource>,
    ) {
        //Play a randomly selected sound
        let rng = &mut rand::rng();
        let sound_paths = [
            "audio/sfx/Crush5.ogg",
            "audio/sfx/Build1.ogg",
            "audio/sfx/Build2.ogg",
        ];
        let Some(path) = sound_paths.choose(rng) else {
            fail!("Unable to load sound file from list");
            return;
        };
        let sound_effect: Handle<AudioSource> = asset_server.load(*path);
        let parent_entity = trigger.target();

        //spawn sound
        let mut sound = commands.spawn((
            AudioPlayer(sound_effect),
            PlaybackSettings::DESPAWN.with_spatial(true).with_spatial_scale(SPATIAL_SCALE),
            ChildOf(parent_entity),
            Transform::default(),
        ));

        if toggles.sound_gizmo
        {
            let gizmo = make_sound_gizmo();
            sound.insert(
                children![(
                    Gizmo {
                        handle: gizmo_assets.add(gizmo),
                        ..default()
                    },
                )],
            );
        }
    }

    fn spawn_server_observer(
        trigger: Trigger<OnAdd, PlacementComponent>,
        mut commands: Commands,
        asset_server: Res<AssetServer>,
        mut gizmo_assets: ResMut<Assets<GizmoAsset>>,
        toggles: Res<DebugTogglesResource>,
    ) {
        let sound_effect: Handle<AudioSource> = asset_server.load("audio/sfx/Wood1.ogg");
        let parent_entity = trigger.target();

        //spawn sound
        let mut sound = commands.spawn((
            AudioPlayer(sound_effect),
            PlaybackSettings::DESPAWN.with_spatial(true).with_spatial_scale(SPATIAL_SCALE),
            ChildOf(parent_entity),
            Transform::default(),
        ));
        if toggles.sound_gizmo
        {
            let gizmo = make_sound_gizmo();
            sound.insert(
                children![(
                    Gizmo {
                        handle: gizmo_assets.add(gizmo),
                        ..default()
                    },
                )],
            );
        }
    }

    //TODO: (Giorgio) use something better than the camera component
    fn spawn_music_observer(
        trigger: Trigger<OnAdd, ThirdPersonCameraComponent>,
        mut commands: Commands,
        asset_server: Res<AssetServer>,
    ) {
        let sound_effect: Handle<AudioSource> = asset_server.load("audio/sfx/Music/Frontier 1 v_1A OGG.ogg");
        commands.spawn((
            AudioPlayer(sound_effect),
            PlaybackSettings::LOOP,));
    }

    fn spawn_foundation_observer(
        trigger: Trigger<OnAdd, FoundationComponent>,
        mut commands: Commands,
        asset_server: Res<AssetServer>,
        mut gizmo_assets: ResMut<Assets<GizmoAsset>>,
        toggles: Res<DebugTogglesResource>,
    ) {
        //Play a randomly selected sound
        let rng = &mut rand::rng();
        let sound_paths = [
            "audio/sfx/Crush5.ogg",
            "audio/sfx/Build1.ogg",
            "audio/sfx/Build2.ogg",
        ];
        let Some(path) = sound_paths.choose(rng) else {
            fail!("Unable to load sound file from list");
            return;
        };
        let sound_effect: Handle<AudioSource> = asset_server.load(*path);
        let parent_entity = trigger.target();

        //spawn sound
        let mut sound= commands.spawn((
            AudioPlayer(sound_effect),
            PlaybackSettings::DESPAWN.with_spatial(true).with_spatial_scale(SPATIAL_SCALE),
            ChildOf(parent_entity),
            Transform::default(),
            ));
        if toggles.sound_gizmo
        {
            let gizmo = make_sound_gizmo();
            sound.insert(
                children![(
                    Gizmo {
                        handle: gizmo_assets.add(gizmo),
                        ..default()
                    },
                )],
            );
        }
    }

    fn spawn_chassis_observer(
        trigger: Trigger<OnAdd, ServerComponent>,
        mut commands: Commands,
        asset_server: Res<AssetServer>,
        mut gizmo_assets: ResMut<Assets<GizmoAsset>>,
        toggles: Res<DebugTogglesResource>,
    ) {
        let sound_effect: Handle<AudioSource> = asset_server.load("audio/sfx/Slide3.ogg");
        let parent_entity = trigger.target();

        //spawn sound
        let mut sound = commands.spawn((
            AudioPlayer(sound_effect),
            PlaybackSettings::DESPAWN.with_spatial(true).with_spatial_scale(SPATIAL_SCALE),
            ChildOf(parent_entity),
            Transform::default(),
            ));
        if toggles.sound_gizmo
        {
            let gizmo = make_sound_gizmo();
            sound.insert(
                children![(
                    Gizmo {
                        handle: gizmo_assets.add(gizmo),
                        ..default()
                    },
                )],
            );
        }
    }

    fn spawn_ping_observer(
        trigger: Trigger<OnAdd, PingComponent>,
        mut commands: Commands,
        asset_server: Res<AssetServer>,
        mut gizmo_assets: ResMut<Assets<GizmoAsset>>,
        toggles: Res<DebugTogglesResource>,
    ) {
        let sound_effect: Handle<AudioSource> = asset_server.load("audio/sfx/Pew1.ogg");
        let parent_entity = trigger.target();

        //spawn sound
        let mut sound = commands.spawn((
            AudioPlayer(sound_effect),
            PlaybackSettings::DESPAWN.with_spatial(true).with_spatial_scale(SpatialScale::new(SPATIAL_SCALE_VALUE/3.0)),
            ChildOf(parent_entity),
            Transform::default(),
            ));
        if toggles.sound_gizmo
        {
            let gizmo = make_sound_gizmo();
            sound.insert(
                children![(
                    Gizmo {
                        handle: gizmo_assets.add(gizmo),
                        ..default()
                    },
                )],
            );
        }
    }

    fn spawn_connection_observer(
        //TODO: (Giorgio) connect this sound when the connection logic is implemented in the gameplay
        //trigger:Trigger<INSERT EVENT HERE>,
        mut commands: Commands,
        asset_server:Res<AssetServer>,
        mut gizmo_assets: ResMut<Assets<GizmoAsset>>,
        toggles: Res<DebugTogglesResource>,
    ) {
        let sound_effect:Handle<AudioSource> = asset_server.load("audio/sfx/PlugIn1.ogg");
        //let parent_entity = trigger.target();

        //spawn sound
        let mut sound = commands.spawn((
            AudioPlayer(sound_effect),
            PlaybackSettings::DESPAWN.with_spatial(true).with_spatial_scale(SPATIAL_SCALE),
            //ChildOf(parent_entity),
            Transform::default(),
            ));
        if toggles.sound_gizmo
        {
            let gizmo = make_sound_gizmo();
            sound.insert(
                children![(
                    Gizmo {
                        handle: gizmo_assets.add(gizmo),
                        ..default()
                    },
                )],
            );
        }
    }

    fn despawn_connection_observer(
        //TODO: (Giorgio) connect this sound when the connection logic is implemented in the gameplay
        //trigger:Trigger<INSERT EVENT HERE>,
        mut commands: Commands,
        asset_server:Res<AssetServer>,
        mut gizmo_assets: ResMut<Assets<GizmoAsset>>,
        toggles: Res<DebugTogglesResource>,
    ) {
        let sound_effect:Handle<AudioSource> = asset_server.load("audio/sfx/PlugOut1.ogg");
        //let parent_entity = trigger.target();

        //spawn sound
        let mut sound = commands.spawn((
            AudioPlayer(sound_effect),
            PlaybackSettings::DESPAWN.with_spatial(true).with_spatial_scale(SPATIAL_SCALE),
            //ChildOf(parent_entity),
            Transform::default(),
            ));
        if toggles.sound_gizmo
        {
            let gizmo = make_sound_gizmo();
            sound.insert(
                children![(
                    Gizmo {
                        handle: gizmo_assets.add(gizmo),
                        ..default()
                    },
                )],
            );
        }
    }

    fn player_jump_observer(
        controller_query: Query<(Entity, &TnuaController)>,
        mut commands: Commands,
        asset_server: Res<AssetServer>,
        mut gizmo_assets: ResMut<Assets<GizmoAsset>>,
        toggles: Res<DebugTogglesResource>,
    ) {
        for (parent_entity, controller) in controller_query.iter() {
            if let Some(TnuaBuiltinJump::NAME) = controller.action_name() {
                let (_, jump_state) = controller
                    .concrete_action::<TnuaBuiltinJump>()
                    .expect("action name mismatch");

                if let TnuaBuiltinJumpState::StartingJump {..} = jump_state {
                    //Play a randomly selected sound
                    let rng = &mut rand::rng();
                    let sound_paths = [
                        "audio/sfx/Crush3.ogg",
                    ];

                    let Some(path) = sound_paths.choose(rng) else {
                        fail!("Unable to load sound file from list");
                        continue;
                    };

                    let sound_effect: Handle<AudioSource> = asset_server.load(*path);

                    //spawn sound
                    let mut sound = commands.spawn((
                        AudioPlayer(sound_effect),
                        PlaybackSettings::DESPAWN.with_spatial(true).with_spatial_scale(SPATIAL_SCALE),
                        Transform::default(),
                        ChildOf(parent_entity),
                        ));
                    if toggles.sound_gizmo
                    {
                        let gizmo = make_sound_gizmo();
                        sound.insert(
                            children![(
                                Gizmo {
                                    handle: gizmo_assets.add(gizmo),
                                    ..default()
                                },
                            )],
                        );
                    }
                }
            }
        }
    }
}
