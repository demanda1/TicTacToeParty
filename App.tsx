import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions, 
  StatusBar,
  DrawerLayoutAndroid,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  FlatList,
  Platform,
  SafeAreaView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withSequence,
  withSpring,
  useSharedValue
} from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Picker } from '@react-native-picker/picker';
import { Audio, AVPlaybackStatus } from 'expo-av';
import * as Font from 'expo-font';

const windowWidth = Dimensions.get('window').width;
const GRID_SIZE = windowWidth * 0.9;
const CELL_SIZE = GRID_SIZE / 3;

// Font loading function
const loadFonts = async () => {
  await Font.loadAsync({
    'TT-Octosquares': require('./assets/fonts/TT Octosquares Trial Bold.ttf'),
    'Super-Adorable': require('./assets/fonts/Super Adorable.ttf'),
    'Retro': require('./assets/fonts/retro.ttf'),
    'Pixel-Digivolve': require('./assets/fonts/Pixel Digivolve.otf'),
    'Pixel-Digivolve-Italic': require('./assets/fonts/Pixel Digivolve Italic.otf'),
    'Joystix': require('./assets/fonts/joystix monospace.otf'),
    'Inlanders': require('./assets/fonts/Inlanders Demo.otf'),
    'Inlanders-2': require('./assets/fonts/Inlanders Demo 2.otf'),
    'AldotheApache': require('./assets/fonts/AldotheApache.ttf'),
    'BostonCaps': require('./assets/fonts/BOSTON CAPS.ttf'),
  });
};

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  xColor: string;
  oColor: string;
  textColor: string;
  fontFamily: string;
  titleFont: string;
  subtitleFont: string;
  buttonFont: string;
}

const THEMES: Record<string, ThemeColors> = {
  default: {
    primary: '#2C3E50',
    secondary: '#34495E',
    accent: '#E74C3C',
    xColor: '#FF6B6B',
    oColor: '#4ECDC4',
    textColor: '#ECF0F1',
    fontFamily: 'TT-Octosquares',
    titleFont: 'TT-Octosquares',
    subtitleFont: 'TT-Octosquares',
    buttonFont: 'TT-Octosquares',
  },
  dark: {
    primary: '#121212',
    secondary: '#1E1E1E',
    accent: '#BB86FC',
    xColor: '#CF6679',
    oColor: '#03DAC6',
    textColor: '#FFFFFF',
    fontFamily: 'Inlanders',
    titleFont: 'Inlanders',
    subtitleFont: 'Inlanders',
    buttonFont: 'Inlanders',
  },
  light: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    accent: '#6200EE',
    xColor: '#FF4081',
    oColor: '#00BCD4',
    textColor: '#000000',
    fontFamily: 'Super-Adorable',
    titleFont: 'Super-Adorable',
    subtitleFont: 'Super-Adorable',
    buttonFont: 'Super-Adorable',
  },
  ocean: {
    primary: '#1B4F72',
    secondary: '#2874A6',
    accent: '#3498DB',
    xColor: '#E74C3C',
    oColor: '#2ECC71',
    textColor: '#ECF0F1',
    fontFamily: 'Pixel-Digivolve',
    titleFont: 'Pixel-Digivolve',
    subtitleFont: 'Pixel-Digivolve',
    buttonFont: 'Pixel-Digivolve',
  },
  sunset: {
    primary: '#D35400',
    secondary: '#E67E22',
    accent: '#F39C12',
    xColor: '#C0392B',
    oColor: '#8E44AD',
    textColor: '#ECF0F1',
    fontFamily: 'Joystix',
    titleFont: 'Joystix',
    subtitleFont: 'Joystix',
    buttonFont: 'Joystix',
  },
  forest: {
    primary: '#145A32',
    secondary: '#196F3D',
    accent: '#27AE60',
    xColor: '#E74C3C',
    oColor: '#F1C40F',
    textColor: '#ECF0F1',
    fontFamily: 'Retro',
    titleFont: 'Retro',
    subtitleFont: 'Retro',
    buttonFont: 'Retro',
  },
  monochrome: {
    primary: '#2C3E50',
    secondary: '#34495E',
    accent: '#95A5A6',
    xColor: '#7F8C8D',
    oColor: '#BDC3C7',
    textColor: '#ECF0F1',
    fontFamily: 'Inlanders-2',
    titleFont: 'Inlanders-2',
    subtitleFont: 'Inlanders-2',
    buttonFont: 'Inlanders-2',
  },
  neon: {
    primary: '#111111',
    secondary: '#1A1A1A',
    accent: '#00FF00',
    xColor: '#FF00FF',
    oColor: '#00FFFF',
    textColor: '#FFFFFF',
    fontFamily: 'AldotheApache',
    titleFont: 'AldotheApache',
    subtitleFont: 'AldotheApache',
    buttonFont: 'AldotheApache',
  }
} as const;

type ThemeName = keyof typeof THEMES;

type IconName = typeof MaterialCommunityIcons.defaultProps.name;

interface IconOption {
  name: IconName;
  label: string;
  category: string;
}

const ICON_OPTIONS: IconOption[] = [
  // Basic Shapes
  { name: 'close', label: 'Simple X', category: 'Basic' },
  { name: 'close-circle', label: 'Circle X', category: 'Basic' },
  { name: 'close-octagon', label: 'Octagon X', category: 'Basic' },
  { name: 'circle-outline', label: 'Circle', category: 'Basic' },
  { name: 'square-outline', label: 'Square', category: 'Basic' },
  { name: 'triangle-outline', label: 'Triangle', category: 'Basic' },
  { name: 'star-outline', label: 'Star', category: 'Basic' },
  { name: 'hexagon-outline', label: 'Hexagon', category: 'Basic' },
  
  // Nature
  { name: 'flower-outline', label: 'Flower', category: 'Nature' },
  { name: 'leaf', label: 'Leaf', category: 'Nature' },
  { name: 'tree', label: 'Tree', category: 'Nature' },
  { name: 'weather-sunny', label: 'Sun', category: 'Nature' },
  { name: 'moon-waning-crescent', label: 'Moon', category: 'Nature' },
  { name: 'cloud-outline', label: 'Cloud', category: 'Nature' },
  { name: 'snowflake', label: 'Snowflake', category: 'Nature' },
  
  // Animals
  { name: 'cat', label: 'Cat', category: 'Animals' },
  { name: 'dog', label: 'Dog', category: 'Animals' },
  { name: 'rabbit', label: 'Rabbit', category: 'Animals' },
  { name: 'owl', label: 'Owl', category: 'Animals' },
  { name: 'butterfly', label: 'Butterfly', category: 'Animals' },
  
  // Objects
  { name: 'heart-outline', label: 'Heart', category: 'Objects' },
  { name: 'crown', label: 'Crown', category: 'Objects' },
  { name: 'diamond-outline', label: 'Diamond', category: 'Objects' },
  { name: 'gift-outline', label: 'Gift', category: 'Objects' },
  { name: 'bell-outline', label: 'Bell', category: 'Objects' },
  
  // Vehicles
  { name: 'car', label: 'Car', category: 'Vehicles' },
  { name: 'airplane', label: 'Airplane', category: 'Vehicles' },
  { name: 'rocket', label: 'Rocket', category: 'Vehicles' },
  { name: 'bike', label: 'Bike', category: 'Vehicles' },
  { name: 'ship-wheel', label: 'Ship', category: 'Vehicles' },
  
  // Space
  { name: 'earth', label: 'Earth', category: 'Space' },
  { name: 'star', label: 'Star', category: 'Space' },
  { name: 'meteor', label: 'Meteor', category: 'Space' },
  { name: 'robot', label: 'Robot', category: 'Space' },
  { name: 'alien', label: 'Alien', category: 'Space' },
  
  // Food
  { name: 'food-apple', label: 'Apple', category: 'Food' },
  { name: 'pizza', label: 'Pizza', category: 'Food' },
  { name: 'cookie', label: 'Cookie', category: 'Food' },
  { name: 'coffee', label: 'Coffee', category: 'Food' },
  { name: 'ice-cream', label: 'Ice Cream', category: 'Food' },
];

interface GameSymbols {
  X: IconName;
  O: IconName;
}

const DEFAULT_SYMBOLS: GameSymbols = {
  X: 'close',
  O: 'circle-outline'
};

const MUSIC_TRACKS = {
  retroVibes: {
    name: 'retroVibes',
    source: require('./assets/audio/retrovibes.mp3'),
  },
  arcadeKid: {
    name: 'arcadeKid',
    source: require('./assets/audio/arcade-kid.mp3'),
  },
  adventureKid: {
    name: 'adventureKid',
    source: require('./assets/audio/adventure-kid.mp3'),
  },
  bossTime: {
    name: 'bossTime',
    source: require('./assets/audio/boss-time.mp3'),
  },
  retroFunk: {
    name: 'retroFunk',
    source: require('./assets/audio/retro-funk.mp3'),
  },
  season: {
    name: 'season',
    source: require('./assets/audio/season.mp3'),
  }
} as const;

type MusicTrackName = keyof typeof MUSIC_TRACKS;

type GameMode = {
  name: string;
  size: number;
  moveLimit: number;
  timeLimit?: number;
  description: string;
  vanishingMoves: boolean;
};

const GAME_MODES: Record<string, GameMode> = {
  default: {
    name: '3x3 Classic',
    size: 3,
    moveLimit: 3,
    vanishingMoves: false,
    description: 'Classic 3x3 tic-tac-toe. Standard rules - get 3 in a row to win!'
  },
  singlePlayer: {
    name: '3x3 vs Computer',
    size: 3,
    moveLimit: 3,
    vanishingMoves: false,
    description: 'Play against the computer! Computer makes basic moves.'
  },
  vanish: {
    name: '3x3 Vanish',
    size: 3,
    moveLimit: 3,
    vanishingMoves: true,
    description: 'Classic 3x3 grid. First move vanishes after 3rd move.'
  },
  fourByFourClassic: {
    name: '4x4 Classic',
    size: 4,
    moveLimit: 4,
    vanishingMoves: false,
    description: 'Traditional 4x4 tic-tac-toe. Standard rules - get 4 in a row to win!'
  },
  fourByFourSinglePlayer: {
    name: '4x4 vs Computer',
    size: 4,
    moveLimit: 4,
    vanishingMoves: false,
    description: 'Play 4x4 against the computer! Computer makes basic moves.'
  },
  fourByFour: {
    name: '4x4 Vanish',
    size: 4,
    moveLimit: 4,
    vanishingMoves: true,
    description: '4x4 grid. First move vanishes after 4th move.'
  },
  fiveByFiveClassic: {
    name: '5x5 Classic',
    size: 5,
    moveLimit: 5,
    vanishingMoves: false,
    description: 'Large 5x5 tic-tac-toe. Standard rules - get 5 in a row to win!'
  },
  fiveByFiveSinglePlayer: {
    name: '5x5 vs Computer',
    size: 5,
    moveLimit: 5,
    vanishingMoves: false,
    description: 'Play 5x5 against the computer! Computer makes basic moves.'
  },
  blitzClassic: {
    name: '3x3 Blitz Classic',
    size: 3,
    moveLimit: 3,
    timeLimit: 10,
    vanishingMoves: false,
    description: '3x3 grid with 10-second time limit. No vanishing moves - pure speed!'
  },
  blitz: {
    name: '3x3 Blitz Vanish',
    size: 3,
    moveLimit: 3,
    timeLimit: 10,
    vanishingMoves: true,
    description: '3x3 grid with 10-second time limit and vanishing moves.'
  },
  fourByFourBlitzClassic: {
    name: '4x4 Blitz Classic',
    size: 4,
    moveLimit: 4,
    timeLimit: 30,
    vanishingMoves: false,
    description: '4x4 grid with 30-second time limit. No vanishing moves - pure speed!'
  },
  fourByFourBlitz: {
    name: '4x4 Blitz Vanish',
    size: 4,
    moveLimit: 4,
    timeLimit: 30,
    vanishingMoves: true,
    description: '4x4 grid with 30-second time limit and vanishing moves.'
  }
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [moveHistory, setMoveHistory] = useState<{ player: string; position: number }[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gamesWon, setGamesWon] = useState({ X: 0, O: 0 });
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('default');
  const [currentView, setCurrentView] = useState('stats');
  const [symbols, setSymbols] = useState<GameSymbols>(DEFAULT_SYMBOLS);
  const [currentMusic, setCurrentMusic] = useState<MusicTrackName>('retroVibes');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isMusicLoaded, setIsMusicLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentGameMode, setCurrentGameMode] = useState<string>('default');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [showTruthOrDarePicker, setShowTruthOrDarePicker] = useState(false);
  const [truthOrDareChoice, setTruthOrDareChoice] = useState<string>('');
  const [isComputerGame, setIsComputerGame] = useState(false);
  const [isComputerTurn, setIsComputerTurn] = useState(false);
  
  // Game mode selection components
  const [selectedSize, setSelectedSize] = useState<number>(3);
  const [selectedOpponent, setSelectedOpponent] = useState<'player' | 'computer'>('player');
  const [selectedSpeed, setSelectedSpeed] = useState<'classic' | 'blitz'>('classic');
  const [selectedVanish, setSelectedVanish] = useState<boolean>(false);
  const [showGameModePicker, setShowGameModePicker] = useState(false);
  
  const scale = useSharedValue(1);
  const confettiRef = useRef(null);
  const drawer = useRef<DrawerLayoutAndroid>(null);

  const theme = THEMES[currentTheme];
  const gameMode = GAME_MODES[currentGameMode] || GAME_MODES['default']; // Fallback to default if undefined
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to build game mode key from selections
  const buildGameModeKey = (size: number, opponent: string, speed: string, vanish: boolean): string => {
    // Handle computer opponents first (they don't support blitz or vanish)
    if (opponent === 'computer') {
      if (size === 3) return 'singlePlayer';
      if (size === 4) return 'fourByFourSinglePlayer';
      if (size === 5) return 'fiveByFiveSinglePlayer';
    }
    
    // Handle player vs player modes
    if (opponent === 'player') {
      // Handle 3x3 modes
      if (size === 3) {
        if (speed === 'blitz') {
          return vanish ? 'blitz' : 'blitzClassic';
        } else {
          return vanish ? 'vanish' : 'default';
        }
      }
      
      // Handle 4x4 modes
      if (size === 4) {
        if (speed === 'blitz') {
          return vanish ? 'fourByFourBlitz' : 'fourByFourBlitzClassic';
        } else {
          return vanish ? 'fourByFour' : 'fourByFourClassic';
        }
      }
      
      // Handle 5x5 modes (no blitz modes available for 5x5)
      if (size === 5) {
        return vanish ? 'fiveByFiveClassic' : 'fiveByFiveClassic'; // 5x5 doesn't have vanish mode
      }
    }
    
    // Fallback to default
    return 'default';
  };

  // Update game mode when selections change
  useEffect(() => {
    const newGameMode = buildGameModeKey(selectedSize, selectedOpponent, selectedSpeed, selectedVanish);
    console.log('Setting game mode:', newGameMode);
    setCurrentGameMode(newGameMode);
  }, [selectedSize, selectedOpponent, selectedSpeed, selectedVanish]);

  // Disable vanish mode when computer opponent is selected
  useEffect(() => {
    if (selectedOpponent !== 'player' && selectedVanish) {
      setSelectedVanish(false);
    }
  }, [selectedOpponent]);

  // Disable blitz mode when computer opponent is selected
  useEffect(() => {
    if (selectedOpponent !== 'player' && selectedSpeed === 'blitz') {
      setSelectedSpeed('classic');
    }
  }, [selectedOpponent]);

  // Disable blitz mode for 5x5 (not supported)
  useEffect(() => {
    if (selectedSize === 5 && selectedSpeed === 'blitz') {
      setSelectedSpeed('classic');
    }
  }, [selectedSize]);

  // Disable vanish mode for 5x5 (not supported)
  useEffect(() => {
    if (selectedSize === 5 && selectedVanish) {
      setSelectedVanish(false);
    }
  }, [selectedSize]);

  const resetGame = () => {
    const gameMode = GAME_MODES[currentGameMode];
    if (!gameMode) {
      console.error('Invalid game mode:', currentGameMode);
      setCurrentGameMode('default');
      return;
    }
    
    const size = gameMode.size;
    setBoard(Array(size * size).fill(null));
    setIsXNext(true);
    setMoveHistory([]);
    setShowConfetti(false);
    setTimeLeft(gameMode.timeLimit || null);
    setIsGameActive(true);
    setWinner(null);
    setIsComputerGame(isComputerMode());
    setIsComputerTurn(false);
  };

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
        setFontsLoaded(true);
      } catch (e) {
        console.warn('Error loading fonts:', e);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (gameMode.timeLimit && isGameActive) {
      setTimeLeft(gameMode.timeLimit);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentGameMode, isGameActive]);

  const handleTimeUp = () => {
    if (gameMode.timeLimit) {
      setIsGameActive(false);
      Alert.alert(
        'Time Up!',
        'The game is a draw due to time limit.',
        [{ text: 'New Game', onPress: resetGame }]
      );
    }
  };

  useEffect(() => {
    // Only reset game if the game mode picker is not open
    // This prevents automatic game starts when changing selections
    if (!showGameModePicker) {
      resetGame();
    }
  }, [currentGameMode, showGameModePicker]);

  useEffect(() => {
    if (isComputerTurn && !winner) {
      makeComputerMove();
    }
  }, [isComputerTurn, board, winner]);

  useEffect(() => {
    async function initAudio() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        playTrack(0);
      } catch (error) {
        console.error('Error initializing audio:', error);
      }
    }
    initAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const playTrack = async (index: number) => {
    try {
      // Cleanup previous track if exists
      if (sound) {
        await sound.unloadAsync();
      }

      const track = Object.values(MUSIC_TRACKS)[index];
      const { sound: newSound } = await Audio.Sound.createAsync(
        track.source,
        {
          shouldPlay: true,
          volume: isMuted ? 0 : 0.5,
        },
        async (status: AVPlaybackStatus) => {
          if (!status.isLoaded) return;
          
          // When track finishes, play next track
          if (status.didJustFinish) {
            const nextIndex = (index + 1) % Object.values(MUSIC_TRACKS).length;
            playTrack(nextIndex);
            setCurrentTrackIndex(nextIndex);
          }
        }
      );

      setSound(newSound);

      // If muted, pause immediately after creation
      if (isMuted) {
        await newSound.pauseAsync();
      }
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const toggleMute = async () => {
    try {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);

      if (sound) {
        if (newMutedState) {
          // Muting - pause the current track
          await sound.pauseAsync();
        } else {
          // Unmuting - resume the current track
          await sound.playAsync();
          await sound.setVolumeAsync(0.5);
        }
      } else if (!newMutedState) {
        // No sound playing and unmuting - start playing
        playTrack(currentTrackIndex);
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  const renderMenuSection = () => (
    <View style={styles.menuSection}>
      <TouchableOpacity 
        style={[styles.menuItem, currentView === 'stats' && styles.menuItemActive]}
        onPress={() => setCurrentView('stats')}
      >
        <MaterialCommunityIcons name="chart-bar" size={24} color={theme.textColor} />
        <Text style={[styles.menuItemText, { color: theme.textColor }]}>Stats</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.menuItem, currentView === 'rules' && styles.menuItemActive]}
        onPress={() => setCurrentView('rules')}
      >
        <MaterialCommunityIcons name="book-open-variant" size={24} color={theme.textColor} />
        <Text style={[styles.menuItemText, { color: theme.textColor }]}>Game Rules</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.menuItem, currentView === 'settings' && styles.menuItemActive]}
        onPress={() => setCurrentView('settings')}
      >
        <MaterialCommunityIcons name="cog" size={24} color={theme.textColor} />
        <Text style={[styles.menuItemText, { color: theme.textColor }]}>Settings</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={[styles.statItem, { backgroundColor: theme.primary }]}>
        <MaterialCommunityIcons name="close" size={24} color={theme.xColor} />
        <Text style={[styles.statText, { color: theme.textColor }]}>Player X Wins: {gamesWon.X}</Text>
      </View>
      <View style={[styles.statItem, { backgroundColor: theme.primary }]}>
        <MaterialCommunityIcons name="circle-outline" size={24} color={theme.oColor} />
        <Text style={[styles.statText, { color: theme.textColor }]}>Player O Wins: {gamesWon.O}</Text>
      </View>
      <TouchableOpacity 
        style={[styles.drawerButton, { backgroundColor: theme.accent }]}
        onPress={() => {
          setGamesWon({ X: 0, O: 0 });
          drawer.current?.closeDrawer();
        }}
      >
        <Text style={[styles.drawerButtonText, { color: theme.textColor }]}>Reset Stats</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRules = () => (
    <ScrollView style={styles.rulesContainer}>
      <Text style={[styles.ruleTitle, { color: theme.textColor }]}>Game Rules</Text>
      
      <View style={styles.ruleSection}>
        <Text style={[styles.ruleText, { color: theme.textColor }]}>
          1. Players take turns placing X's and O's on the board.
        </Text>
        <Text style={[styles.ruleText, { color: theme.textColor }]}>
          2. Win by getting three (or four) of your marks in a row (horizontal, vertical, or diagonal).
        </Text>
        <Text style={[styles.ruleText, { color: theme.textColor }]}>
          3. Some modes have special "vanishing moves" - your first move disappears after placing your 3rd/4th move!
        </Text>
        <Text style={[styles.ruleText, { color: theme.textColor }]}>
          4. If the board fills up with no winner, it's a draw.
        </Text>
        <Text style={[styles.ruleText, { color: theme.textColor }]}>
          5. The loser must choose between Truth or Dare as a fun consequence! 😄
        </Text>
      </View>

      <Text style={[styles.ruleTitle, { color: theme.textColor }]}>Game Modes</Text>
      
      <View style={styles.ruleSection}>
        <Text style={[styles.gameModeTitle, { color: theme.textColor }]}>3x3 Classic</Text>
        <Text style={[styles.ruleText, { color: theme.textColor }]}>
          • Traditional tic-tac-toe rules{'\n'}
          • No vanishing moves - pieces stay on board{'\n'}
          • Perfect for beginners and classic gameplay
        </Text>

        <Text style={[styles.gameModeTitle, { color: theme.textColor }]}>3x3 vs Computer</Text>
        <Text style={[styles.ruleText, { color: theme.textColor }]}>
          • Play against the computer (Easy difficulty){'\n'}
          • You are X, Computer is O{'\n'}
          • Computer tries to win, then block, then makes random moves
        </Text>

        <Text style={[styles.gameModeTitle, { color: theme.textColor }]}>3x3 Vanish</Text>
        <Text style={[styles.ruleText, { color: theme.textColor }]}>
          • Classic 3x3 grid with a twist{'\n'}
          • First move vanishes after 3rd move{'\n'}
          • Adds strategic depth to the classic game
        </Text>

        <Text style={[styles.gameModeTitle, { color: theme.textColor }]}>4x4 Classic</Text>
        <Text style={[styles.ruleText, { color: theme.textColor }]}>
          • Traditional 4x4 tic-tac-toe rules{'\n'}
          • No vanishing moves - pieces stay on board{'\n'}
          • Get 4 in a row to win - more strategic depth
        </Text>

        <Text style={[styles.gameModeTitle, { color: theme.textColor }]}>4x4 vs Computer</Text>
        <Text style={[styles.ruleText, { color: theme.textColor }]}>
          • Play 4x4 against the computer (Easy difficulty){'\n'}
          • You are X, Computer is O{'\n'}
          • Computer tries to win, then block, then makes random moves
        </Text>

        <Text style={[styles.gameModeTitle, { color: theme.textColor }]}>4x4 Vanish</Text>
        <Text style={[styles.ruleText, { color: theme.textColor }]}>
          • 4x4 grid with vanishing moves{'\n'}
          • First move vanishes after 4th move{'\n'}
          • More challenging and longer games
        </Text>

        <Text style={[styles.gameModeTitle, { color: theme.textColor }]}>5x5 Classic</Text>
        <Text style={[styles.ruleText, { color: theme.textColor }]}>
          • Large 5x5 tic-tac-toe board{'\n'}
          • No vanishing moves - pieces stay on board{'\n'}
          • Get 5 in a row to win - maximum strategic depth
        </Text>

        <Text style={[styles.gameModeTitle, { color: theme.textColor }]}>5x5 vs Computer</Text>
        <Text style={[styles.ruleText, { color: theme.textColor }]}>
          • Play 5x5 against the computer (Easy difficulty){'\n'}
          • You are X, Computer is O{'\n'}
          • Computer tries to win, then block, then makes random moves
        </Text>

        <Text style={[styles.gameModeTitle, { color: theme.textColor }]}>3x3 Blitz Classic</Text>
        <Text style={[styles.ruleText, { color: theme.textColor }]}>
          • 3x3 grid with 10-second time limit{'\n'}
          • No vanishing moves - pure speed!
        </Text>

        <Text style={[styles.gameModeTitle, { color: theme.textColor }]}>3x3 Blitz Vanish</Text>
        <Text style={[styles.ruleText, { color: theme.textColor }]}>
          • 3x3 grid with 10-second time limit and vanishing moves
        </Text>

        <Text style={[styles.gameModeTitle, { color: theme.textColor }]}>4x4 Blitz Classic</Text>
        <Text style={[styles.ruleText, { color: theme.textColor }]}>
          • 4x4 grid with 30-second time limit{'\n'}
          • No vanishing moves - pure speed!
        </Text>

        <Text style={[styles.gameModeTitle, { color: theme.textColor }]}>4x4 Blitz Vanish</Text>
        <Text style={[styles.ruleText, { color: theme.textColor }]}>
          • 4x4 grid with 30-second time limit and vanishing moves
        </Text>
      </View>
    </ScrollView>
  );

  const renderMusicSettings = () => (
    <View style={styles.settingSection}>
      <Text style={[styles.settingTitle, { color: theme.textColor }]}>Music</Text>
      <View style={[styles.pickerContainer, { backgroundColor: theme.secondary }]}>
        <Picker
          selectedValue={currentMusic}
          onValueChange={(itemValue) => setCurrentMusic(itemValue as MusicTrackName)}
          style={[styles.picker, { color: theme.textColor }]}
          dropdownIconColor={theme.textColor}
        >
          {Object.values(MUSIC_TRACKS).map((track) => (
            <Picker.Item
              key={track.name}
              label={track.name}
              value={track.name}
              style={{ backgroundColor: theme.secondary }}
              color={theme.textColor}
            />
          ))}
        </Picker>
      </View>
      <Text style={[styles.musicStatus, { color: theme.textColor }]}>
        {currentMusic !== 'retroVibes' && !isMusicLoaded ? 'Loading music...' : ''}
      </Text>
    </View>
  );

  const renderSymbolSettings = () => {
    const renderPickerItems = (isXSymbol: boolean) => {
      const otherPlayerSymbol = isXSymbol ? symbols.O : symbols.X;
      
      return ICON_OPTIONS.map((option) => {
        const isDisabled = option.name === otherPlayerSymbol;
        return (
          <Picker.Item
            key={option.name}
            label={`${option.label}                                `}
            value={option.name}
            enabled={!isDisabled}
            style={{ 
              backgroundColor: theme.secondary,
              color: isDisabled ? 'gray' : theme.textColor,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            color={isDisabled ? 'gray' : (isXSymbol ? theme.xColor : theme.oColor)}
          />
        );
      });
    };

    return (
      <View style={styles.symbolSettings}>
        <Text style={[styles.settingTitle, { color: theme.textColor }]}>Game Symbols</Text>
        
        <View style={styles.symbolRow}>
          <View style={[styles.symbolPickerContainer, { backgroundColor: theme.secondary }]}>
            <Text style={[styles.symbolLabel, { color: theme.textColor }]}>X Symbol</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={symbols.X}
                onValueChange={(itemValue) => {
                  if (itemValue !== symbols.O) {
                    setSymbols(prev => ({ ...prev, X: itemValue as IconName }));
                  }
                }}
                style={[styles.symbolPicker, { color: theme.xColor }]}
                dropdownIconColor={theme.textColor}
              >
                {renderPickerItems(true)}
              </Picker>
              <MaterialCommunityIcons
                name={symbols.X}
                size={24}
                color={theme.xColor}
                style={styles.pickerIcon}
              />
            </View>
          </View>

          <View style={[styles.symbolPickerContainer, { backgroundColor: theme.secondary }]}>
            <Text style={[styles.symbolLabel, { color: theme.textColor }]}>O Symbol</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={symbols.O}
                onValueChange={(itemValue) => {
                  if (itemValue !== symbols.X) {
                    setSymbols(prev => ({ ...prev, O: itemValue as IconName }));
                  }
                }}
                style={[styles.symbolPicker, { color: theme.oColor }]}
                dropdownIconColor={theme.textColor}
              >
                {renderPickerItems(false)}
              </Picker>
              <MaterialCommunityIcons
                name={symbols.O}
                size={24}
                color={theme.oColor}
                style={styles.pickerIcon}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.resetSymbolsButton, { backgroundColor: theme.secondary }]}
          onPress={() => setSymbols(DEFAULT_SYMBOLS)}
        >
          <Text style={[styles.resetSymbolsButtonText, { color: theme.textColor }]}>Reset</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSettings = () => {
    const renderPickerItems = (isXSymbol: boolean) => {
      const otherPlayerSymbol = isXSymbol ? symbols.O : symbols.X;
      
      return ICON_OPTIONS.map((option) => {
        const isDisabled = option.name === otherPlayerSymbol;
        return (
          <Picker.Item
            key={option.name}
            label={`${option.label}                                `}
            value={option.name}
            enabled={!isDisabled}
            style={{ 
              backgroundColor: theme.secondary,
              color: isDisabled ? 'gray' : theme.textColor,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            color={isDisabled ? 'gray' : (isXSymbol ? theme.xColor : theme.oColor)}
          />
        );
      });
    };

    return (
      <ScrollView style={styles.settingsContainer}>
        <Text style={[styles.settingTitle, { color: theme.textColor }]}>Theme</Text>
        <View style={[styles.pickerContainer, { backgroundColor: theme.secondary }]}>
          <Picker
            selectedValue={currentTheme}
            onValueChange={(itemValue) => setCurrentTheme(itemValue as ThemeName)}
            style={[styles.picker, { color: theme.textColor }]}
            dropdownIconColor={theme.textColor}
          >
            {Object.keys(THEMES).map((themeName) => (
              <Picker.Item
                key={themeName}
                label={themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                value={themeName}
                style={{ backgroundColor: theme.secondary }}
                color={theme.textColor}
              />
            ))}
          </Picker>
        </View>

        <Text style={[styles.settingTitle, { color: theme.textColor }]}>Change Icons</Text>
        <View style={[styles.themePreview, { backgroundColor: THEMES[currentTheme].primary }]}>
          <View style={[styles.themePreviewIcons, { backgroundColor: THEMES[currentTheme].secondary }]}>
            <View style={styles.symbolPickerContainer}>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={symbols.X}
                  onValueChange={(itemValue) => {
                    if (itemValue !== symbols.O) {
                      setSymbols(prev => ({ ...prev, X: itemValue as IconName }));
                    }
                  }}
                  style={[styles.symbolPicker, { color: theme.xColor }]}
                  dropdownIconColor={theme.textColor}
                >
                  {renderPickerItems(true)}
                </Picker>
                <MaterialCommunityIcons
                  name={symbols.X}
                  size={32}
                  color={theme.xColor}
                  style={styles.pickerIcon}
                />
              </View>
            </View>

            <View style={styles.symbolPickerContainer}>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={symbols.O}
                  onValueChange={(itemValue) => {
                    if (itemValue !== symbols.X) {
                      setSymbols(prev => ({ ...prev, O: itemValue as IconName }));
                    }
                  }}
                  style={[styles.symbolPicker, { color: theme.oColor }]}
                  dropdownIconColor={theme.textColor}
                >
                  {renderPickerItems(false)}
                </Picker>
                <MaterialCommunityIcons
                  name={symbols.O}
                  size={32}
                  color={theme.oColor}
                  style={styles.pickerIcon}
                />
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.resetSymbolsButton, { backgroundColor: theme.secondary }]}
          onPress={() => setSymbols(DEFAULT_SYMBOLS)}
        >
          <Text style={[styles.resetSymbolsButtonText, { color: theme.textColor }]}>Reset</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderDrawerContent = () => (
    <View style={[styles.drawerContainer, { backgroundColor: theme.secondary }]}>
      {renderMenuSection()}
      <View style={styles.drawerContent}>
        {currentView === 'stats' && renderStats()}
        {currentView === 'rules' && renderRules()}
        {currentView === 'settings' && renderSettings()}
      </View>
    </View>
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const checkWinner = (squares: (string | null)[]) => {
    const size = gameMode.size;
    const lines: number[][] = [];
    
    // Rows
    for (let i = 0; i < size; i++) {
      lines.push(Array.from({ length: size }, (_, j) => i * size + j));
    }
    
    // Columns
    for (let i = 0; i < size; i++) {
      lines.push(Array.from({ length: size }, (_, j) => i + j * size));
    }
    
    // Diagonals
    lines.push(Array.from({ length: size }, (_, i) => i * size + i));
    lines.push(Array.from({ length: size }, (_, i) => (i + 1) * size - (i + 1)));

    for (let line of lines) {
      const firstValue = squares[line[0]];
      if (!firstValue) continue;
      
      if (line.every(index => squares[index] === firstValue)) {
        return firstValue;
      }
    }
    return null;
  };

  const handlePress = (index: number, isComputerMove: boolean = false) => {
    if (board[index] || winner || !isGameActive) return;
    
    // In AI games, prevent human from moving during AI turn (but allow computer moves)
    if (isComputerGame && isComputerTurn && !isComputerMove) return;

    const newBoard = [...board];
    const currentPlayer = isXNext ? 'X' : 'O';
    newBoard[index] = currentPlayer;

    const newMoveHistory = [...moveHistory, { player: currentPlayer, position: index }];
    
    // Check for win after placing the move
      const hasWon = checkWinner(newBoard);
    if (hasWon) {
      setBoard(newBoard);
      setMoveHistory(newMoveHistory);
      setIsXNext(!isXNext);
      setGamesWon(prev => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer] + 1
      }));
      setWinner(currentPlayer);
      setIsComputerTurn(false);
      setTimeout(() => {
        setShowConfetti(true);
        setIsGameActive(false);
        if (!isComputerGame) {
          setShowTruthOrDarePicker(true);
        }
      }, 1000);
      return;
    }

    // Apply vanishing moves logic only for modes that have it enabled
    if (gameMode.vanishingMoves) {
      const playerMoves = newMoveHistory.filter(move => move.player === currentPlayer);
      if (playerMoves.length === gameMode.moveLimit) {
        const firstMoveIndex = moveHistory.findIndex(move => move.player === currentPlayer);
        const firstMovePosition = moveHistory[firstMoveIndex].position;
        newBoard[firstMovePosition] = null;
        newMoveHistory.splice(firstMoveIndex, 1);
      }
    }

    setBoard(newBoard);
    setMoveHistory(newMoveHistory);
    setIsXNext(!isXNext);

    // Handle computer turn - only trigger if this was a human move
    if (isComputerGame && !isComputerMove && currentPlayer === 'X') {
      setIsComputerTurn(true);
    } else {
      setIsComputerTurn(false);
    }

    scale.value = withSequence(
      withSpring(1.2),
      withSpring(1)
    );
  };

  const handleTruthOrDareSelect = (value: string) => {
    setShowTruthOrDarePicker(false);
    resetGame();
  };

  const renderCell = (index: number) => {
    const value = board[index] as keyof GameSymbols | null;
    const cellSize = GRID_SIZE / gameMode.size;
    
    return (
      <TouchableOpacity
        key={index}
        style={[styles.cell, { 
          width: cellSize, 
          height: cellSize,
          backgroundColor: theme.secondary
        }]}
        onPress={() => handlePress(index)}
      >
        <Animated.View style={[styles.cellContent, animatedStyle]}>
          {value && (
            <MaterialCommunityIcons
              name={symbols[value]}
              size={cellSize * 0.6}
              color={value === 'X' ? theme.xColor : theme.oColor}
            />
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderBoard = () => {
    return (
      <View style={[styles.board, { 
        backgroundColor: theme.secondary,
        width: GRID_SIZE,
        height: GRID_SIZE
      }]}>
        {board.map((_, index) => renderCell(index))}
      </View>
    );
  };

  const isDraw = !winner && board.every(cell => cell !== null);

  // Simple Computer Logic Functions
  const isComputerMode = () => {
    return currentGameMode === 'singlePlayer' || 
           currentGameMode === 'fourByFourSinglePlayer' ||
           currentGameMode === 'fiveByFiveSinglePlayer';
  };

  const getEmptySquares = (squares: (string | null)[]) => {
    return squares.map((square, index) => square === null ? index : null).filter(val => val !== null) as number[];
  };

  const checkWinningMove = (squares: (string | null)[], player: string): number | null => {
    const size = gameMode.size;
    const lines: number[][] = [];
    
    // Rows
    for (let i = 0; i < size; i++) {
      lines.push(Array.from({ length: size }, (_, j) => i * size + j));
    }
    
    // Columns
    for (let i = 0; i < size; i++) {
      lines.push(Array.from({ length: size }, (_, j) => i + j * size));
    }
    
    // Diagonals
    lines.push(Array.from({ length: size }, (_, i) => i * size + i));
    lines.push(Array.from({ length: size }, (_, i) => (i + 1) * size - (i + 1)));

    for (let line of lines) {
      const playerCount = line.filter(index => squares[index] === player).length;
      const emptyCount = line.filter(index => squares[index] === null).length;
      
      if (playerCount === size - 1 && emptyCount === 1) {
        return line.find(index => squares[index] === null) || null;
      }
    }
    return null;
  };

  const getComputerMove = (squares: (string | null)[]): number => {
    const emptySquares = getEmptySquares(squares);
    
    if (emptySquares.length === 0) return -1;
    
    // 1. Try to win
    const winMove = checkWinningMove(squares, 'O');
    if (winMove !== null) return winMove;
    
    // 2. Try to block player from winning
    const blockMove = checkWinningMove(squares, 'X');
    if (blockMove !== null) return blockMove;
    
    // 3. Prefer strategic positions based on board size
    const size = gameMode.size;
    
    if (size === 3) {
      // 3x3: Prefer center, then corners
      if (squares[4] === null) return 4;
      
      const corners = [0, 2, 6, 8];
      const availableCorners = corners.filter(index => squares[index] === null);
      if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
      }
    } else if (size === 4) {
      // 4x4: Prefer center positions, then corners
      const centerPositions = [5, 6, 9, 10]; // Inner 2x2 center
      const availableCenters = centerPositions.filter(index => squares[index] === null);
      if (availableCenters.length > 0) {
        return availableCenters[Math.floor(Math.random() * availableCenters.length)];
      }
      
      const corners = [0, 3, 12, 15];
      const availableCorners = corners.filter(index => squares[index] === null);
      if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
      }
    } else if (size === 5) {
      // 5x5: Prefer center, then inner positions, then corners
      if (squares[12] === null) return 12; // True center
      
      const innerPositions = [6, 7, 8, 11, 13, 16, 17, 18]; // Around center
      const availableInner = innerPositions.filter(index => squares[index] === null);
      if (availableInner.length > 0) {
        return availableInner[Math.floor(Math.random() * availableInner.length)];
      }
      
      const corners = [0, 4, 20, 24];
      const availableCorners = corners.filter(index => squares[index] === null);
      if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
      }
    }
    
    // 4. Make random move
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  };

  const makeComputerMove = () => {
    if (!isComputerGame || !isComputerTurn || winner) return;
    
    setTimeout(() => {
      const isHard = currentGameMode === 'singlePlayerHard' || 
                     currentGameMode === 'fourByFourSinglePlayerHard' ||
                     currentGameMode === 'fiveByFiveSinglePlayerHard';
      const computerMoveIndex = getComputerMove(board);
      
      if (computerMoveIndex !== -1) {
        handlePress(computerMoveIndex, true);
      }
    }, 800); // Slightly longer delay for more natural feel
  };

  // Pause game when game mode picker is open
  useEffect(() => {
    if (showGameModePicker) {
      setIsGameActive(false);
      // Clear any running timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [showGameModePicker]);

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: theme.primary }]}>
        <Text style={{ color: theme.textColor }}>Loading...</Text>
      </View>
    );
  }

  const mainContent = (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <StatusBar barStyle={currentTheme === 'light' ? 'dark-content' : 'light-content'} />
      <View style={styles.subtitle}>
        {winner ? (
          <View style={styles.subtitleContent}>
            <Text style={[styles.subtitleText, { color: theme.textColor }]}>Winner: </Text>
            <MaterialCommunityIcons
              name={symbols[winner as keyof GameSymbols]}
              size={24}
              color={winner === 'X' ? theme.xColor : theme.oColor}
            />
          </View>
        ) : isDraw ? (
          <Text style={[styles.subtitleText, { color: theme.textColor }]}>It's a Draw!</Text>
        ) : (
          <View style={styles.subtitleContent}>
            <Text style={[styles.subtitleText, { color: theme.textColor, fontFamily: theme.subtitleFont }]}>
              {isComputerGame && !isXNext ? 'Computer Turn: ' : 'Next Player: '}
      </Text>
            <MaterialCommunityIcons
              name={symbols[isXNext ? 'X' : 'O']}
              size={24}
              color={isXNext ? theme.xColor : theme.oColor}
            />
      </View>
        )}
      </View>
      {renderBoard()}
      <TouchableOpacity 
        style={[styles.resetButton, { backgroundColor: theme.accent }]} 
        onPress={resetGame}
      >
        <Text style={[styles.resetButtonText, { color: theme.textColor }]}>New Game</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.primary }]}>
      <DrawerLayoutAndroid
        ref={drawer}
        drawerWidth={300}
        drawerPosition="left"
        renderNavigationView={renderDrawerContent}
      >
        <View style={[styles.container, { backgroundColor: theme.primary }]}>
          <StatusBar barStyle={currentTheme === 'light' ? 'dark-content' : 'light-content'} />
          
          {/* Game Title Header */}
          <View style={[styles.headerContainer, { backgroundColor: theme.secondary }]}>
            <Text style={[styles.gameTitle, { color: theme.textColor, fontFamily: theme.titleFont }]}>
              Tic Tac Toe Party
            </Text>
          </View>

          {/* Navigation Bar */}
          <View style={[styles.navigationBar, { backgroundColor: theme.secondary }]}>
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: theme.primary }]}
              onPress={() => drawer.current?.openDrawer()}
            >
              <MaterialCommunityIcons name="menu" size={28} color={theme.textColor} />
            </TouchableOpacity>

            {/* Game Mode Picker */}
            <View style={[styles.gameModeContainer, { backgroundColor: theme.primary }]}>
              <Text style={[styles.gameModeLabel, { color: theme.textColor }]}>Game Mode</Text>
              <TouchableOpacity 
                style={[styles.gameModeButton, { backgroundColor: theme.secondary }]}
                onPress={() => setShowGameModePicker(true)}
              >
                <Text style={[styles.gameModeButtonText, { color: theme.textColor }]}>
                  {gameMode.name}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color={theme.textColor} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: theme.primary }]}
              onPress={toggleMute}
            >
              <MaterialCommunityIcons 
                name={isMuted ? "volume-off" : "volume-high"} 
                size={28} 
                color={theme.textColor} 
              />
            </TouchableOpacity>
          </View>

          {/* Timer Display for Blitz Mode */}
          {gameMode.timeLimit && (
            <View style={[styles.timerContainer, { backgroundColor: theme.secondary }]}>
              <Text style={[styles.timerText, { color: theme.textColor }]}>
                Time Left: {timeLeft}s
              </Text>
            </View>
          )}

          {/* Game Content */}
          <View style={styles.gameContent}>
            <View style={styles.subtitle}>
              {winner ? (
                <View style={styles.subtitleContent}>
                  <Text style={[styles.subtitleText, { color: theme.textColor }]}>Winner: </Text>
                  <MaterialCommunityIcons
                    name={symbols[winner as keyof GameSymbols]}
                    size={24}
                    color={winner === 'X' ? theme.xColor : theme.oColor}
                  />
                </View>
              ) : isDraw ? (
                <Text style={[styles.subtitleText, { color: theme.textColor }]}>It's a Draw!</Text>
              ) : (
                <View style={styles.subtitleContent}>
                  <Text style={[styles.subtitleText, { color: theme.textColor, fontFamily: theme.subtitleFont }]}>
                    {isComputerGame && !isXNext ? 'Computer Turn: ' : 'Next Player: '}
                  </Text>
                  <MaterialCommunityIcons
                    name={symbols[isXNext ? 'X' : 'O']}
                    size={24}
                    color={isXNext ? theme.xColor : theme.oColor}
                  />
                </View>
              )}
            </View>
            {renderBoard()}
            <TouchableOpacity 
              style={[styles.resetButton, { backgroundColor: theme.accent }]} 
              onPress={resetGame}
            >
              <Text style={[styles.resetButtonText, { color: theme.textColor }]}>New Game</Text>
            </TouchableOpacity>
          </View>

          {showConfetti && (
            <ConfettiCannon
              count={200}
              origin={{x: windowWidth/2, y: -10}}
              autoStart={true}
              fadeOut={true}
              explosionSpeed={350}
              fallSpeed={2500}
              ref={confettiRef}
              colors={[theme.xColor, theme.oColor, theme.accent, '#9B59B6']}
              autoStartDelay={0}
            />
          )}

          {showTruthOrDarePicker && (
            <View style={[styles.pickerOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
              <View style={[styles.truthOrDarePickerContainer, { backgroundColor: theme.secondary }]}>
                <Text style={[styles.pickerTitle, { color: theme.textColor }]}>
                  {winner === 'X' ? 'Player O' : 'Player X'} Lost! 😅
                </Text>
                <Text style={[styles.pickerSubtitle, { color: theme.textColor }]}>
                  Choose your fate:
                </Text>
                <View style={styles.truthOrDareButtonsContainer}>
                  <TouchableOpacity 
                    style={[styles.truthOrDareButton, { backgroundColor: theme.accent }]}
                    onPress={() => handleTruthOrDareSelect('truth')}
                  >
                    <Text style={[styles.truthOrDareButtonText, { color: theme.textColor }]}>Truth</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.truthOrDareButton, { backgroundColor: theme.accent }]}
                    onPress={() => handleTruthOrDareSelect('dare')}
                  >
                    <Text style={[styles.truthOrDareButtonText, { color: theme.textColor }]}>Dare</Text>
          </TouchableOpacity>
        </View>
              </View>
            </View>
          )}

          {showGameModePicker && (
            <View style={[styles.pickerOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
              <View style={[styles.gameModePickerContainer, { backgroundColor: theme.secondary }]}>
                <Text style={[styles.pickerTitle, { color: theme.textColor }]}>
                  Game Mode Setup
                </Text>
                
                {/* Row 1: Size and Opponent */}
                <View style={styles.gameModeRow}>
                  <View style={[styles.gameModePickerSmall, { backgroundColor: theme.primary }]}>
                    <Text style={[styles.smallPickerLabel, { color: theme.textColor }]}>Board Size</Text>
                    <TouchableOpacity 
                      style={[styles.pickerButton, { backgroundColor: theme.secondary }]}
                      onPress={() => {
                        const sizes = [3, 4, 5];
                        const currentIndex = sizes.indexOf(selectedSize);
                        const nextIndex = (currentIndex + 1) % sizes.length;
                        setSelectedSize(sizes[nextIndex]);
                      }}
                    >
                      <Text style={[styles.pickerButtonText, { color: theme.textColor }]}>
                        {selectedSize}x{selectedSize}
                      </Text>
                      <MaterialCommunityIcons name="chevron-down" size={20} color={theme.textColor} />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={[styles.gameModePickerSmall, { backgroundColor: theme.primary }]}>
                    <Text style={[styles.smallPickerLabel, { color: theme.textColor }]}>Opponent</Text>
                    <TouchableOpacity 
                      style={[styles.pickerButton, { backgroundColor: theme.secondary }]}
                      onPress={() => {
                        const opponents = ['player', 'computer'];
                        const currentIndex = opponents.indexOf(selectedOpponent);
                        const nextIndex = (currentIndex + 1) % opponents.length;
                        setSelectedOpponent(opponents[nextIndex] as 'player' | 'computer');
                      }}
                    >
                      <Text style={[styles.pickerButtonText, { color: theme.textColor }]}>
                        {selectedOpponent === 'player' ? 'Player' : 'Computer'}
                      </Text>
                      <MaterialCommunityIcons name="chevron-down" size={20} color={theme.textColor} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* Row 2: Speed and Vanish */}
                <View style={styles.gameModeRow}>
                  <View style={[styles.gameModePickerSmall, { backgroundColor: theme.primary }]}>
                    <Text style={[styles.smallPickerLabel, { color: theme.textColor }]}>Game Speed</Text>
                    <TouchableOpacity 
                      style={[
                        styles.pickerButton, 
                        { backgroundColor: theme.secondary },
                        (selectedOpponent !== 'player' || selectedSize === 5) && styles.pickerButtonDisabled
                      ]}
                      onPress={() => {
                        console.log('Game Speed button pressed');
                        console.log('selectedOpponent:', selectedOpponent);
                        console.log('selectedSpeed:', selectedSpeed);
                        console.log('selectedSize:', selectedSize);
                        
                        if (selectedOpponent === 'player' && selectedSize !== 5) {
                          const newSpeed = selectedSpeed === 'classic' ? 'blitz' : 'classic';
                          console.log('Setting new speed:', newSpeed);
                          setSelectedSpeed(newSpeed);
                        }
                      }}
                      disabled={selectedOpponent !== 'player' || selectedSize === 5}
                    >
                      <Text style={[
                        styles.pickerButtonText, 
                        { 
                          color: (selectedOpponent !== 'player' || selectedSize === 5)
                            ? 'rgba(255,255,255,0.5)'
                            : theme.textColor 
                        }
                      ]}>
                        {selectedSpeed === 'classic' ? 'Classic' : 'Blitz'}
                        {selectedOpponent !== 'player' ? ' (Classic Only)' : ''}
                        {selectedSize === 5 ? ' (Classic Only)' : ''}
                      </Text>
                      <MaterialCommunityIcons 
                        name="chevron-down" 
                        size={20} 
                        color={(selectedOpponent !== 'player' || selectedSize === 5)
                          ? 'rgba(255,255,255,0.5)'
                          : theme.textColor
                        } 
                      />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={[styles.vanishToggleContainer, { backgroundColor: theme.primary }]}>
                    <Text style={[styles.smallPickerLabel, { color: theme.textColor }]}>Vanish Mode</Text>
                    <View style={styles.radioButtonContainer}>
                      <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => setSelectedVanish(false)}
                        disabled={selectedOpponent !== 'player' || selectedSize === 5}
                      >
                        <View style={[
                          styles.radioCircle,
                          { borderColor: theme.textColor },
                          (selectedOpponent !== 'player' || selectedSize === 5) && styles.radioDisabled
                        ]}>
                          {!selectedVanish && <View style={[styles.radioDot, { backgroundColor: theme.accent }]} />}
                        </View>
                        <Text style={[
                          styles.radioText, 
                          { color: (selectedOpponent !== 'player' || selectedSize === 5) ? 'rgba(255,255,255,0.5)' : theme.textColor }
                        ]}>Off</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => setSelectedVanish(true)}
                        disabled={selectedOpponent !== 'player' || selectedSize === 5}
                      >
                        <View style={[
                          styles.radioCircle,
                          { borderColor: theme.textColor },
                          (selectedOpponent !== 'player' || selectedSize === 5) && styles.radioDisabled
                        ]}>
                          {selectedVanish && <View style={[styles.radioDot, { backgroundColor: theme.accent }]} />}
                        </View>
                        <Text style={[
                          styles.radioText, 
                          { color: (selectedOpponent !== 'player' || selectedSize === 5) ? 'rgba(255,255,255,0.5)' : theme.textColor }
                        ]}>On</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.gameModePickerButtons}>
                  <TouchableOpacity 
                    style={[styles.gameModePickerButton, { backgroundColor: theme.accent }]}
                    onPress={() => {
                      setShowGameModePicker(false);
                      // Reset and start the game after closing the picker
                      setTimeout(() => {
                        resetGame();
                      }, 100);
                    }}
                  >
                    <Text style={[styles.gameModePickerButtonText, { color: theme.textColor }]}>Start Game</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </DrawerLayoutAndroid>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gameModeContainer: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 8,
    padding: 4,
    justifyContent: 'center',
    minHeight: 60,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gameModeLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  pickerWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  gameModePicker: {
    minHeight: 40,
    width: '100%',
    backgroundColor: 'transparent',
  },
  selectedModeText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingVertical: 4,
  },
  timerContainer: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  cell: {
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cellContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  subtitle: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  subtitleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitleText: {
    fontSize: 24,
  },
  resetButton: {
    marginTop: 30,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  resetButtonText: {
    color: '#ECF0F1',
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: '#34495E',
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ECF0F1',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    marginTop: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#2C3E50',
    padding: 15,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statText: {
    color: '#ECF0F1',
    fontSize: 18,
    marginLeft: 10,
  },
  drawerButton: {
    backgroundColor: '#E74C3C',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  drawerButtonText: {
    color: '#ECF0F1',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuSection: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  menuItemActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 10,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  rulesContainer: {
    flex: 1,
    padding: 15,
  },
  ruleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  ruleSection: {
    marginBottom: 20,
  },
  ruleText: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
  },
  settingsContainer: {
    padding: 15,
  },
  settingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  pickerContainer: {
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  themePreview: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  themePreviewIcons: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'space-around',
    width: '100%',
  },
  symbolRow: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  symbolPickerContainer: {
    flex: 1,
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  symbolPicker: {
    height: 50,
    width: '100%',
  },
  symbolLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  symbolSettings: {
    marginTop: 30,
  },
  resetSymbolsButton: {
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  resetSymbolsButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pickerIcon: {
    position: 'absolute',
    right: 30,
    pointerEvents: 'none',
  },
  settingSection: {
    marginBottom: 20,
  },
  musicStatus: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    fontStyle: 'italic',
  },
  muteButton: {
    padding: 12,
    borderRadius: 8,
  },
  gameModeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  truthOrDarePickerContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  pickerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  pickerSubtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  truthOrDareButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  truthOrDareButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  truthOrDareButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameModeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  gameModePickerSmall: {
    flex: 1,
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  smallPickerLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  smallPicker: {
    height: 50,
    width: '100%',
    color: '#FFFFFF',
  },
  vanishToggleContainer: {
    flex: 1,
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 5,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderRadius: 8,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    // This will be handled by the radioDot
  },
  radioDisabled: {
    opacity: 0.3,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  radioText: {
    fontSize: 12,
    fontWeight: '500',
  },
  gameModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gameModeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameModePickerContainer: {
    width: '90%',
    padding: 25,
    borderRadius: 15,
    alignItems: 'stretch',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  gameModePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  gameModePickerButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gameModePickerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pickerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerButtonDisabled: {
    opacity: 0.5,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#34495E',
  },
  headerContainer: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  gameContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
