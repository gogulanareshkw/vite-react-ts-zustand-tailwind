import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Cog6ToothIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon, 
  TrophyIcon, 
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface LotteryGameSetting {
  _id: string;
  lotteryGameType: number;
  gameStopHour: string;
  gameDiscountStopHour: string;
  minimumAmountForPlay: number;
  agentCommissionInPercent: number;
  lotteryGameDrawDates?: string;
  // Discounts
  firstPrizePlayDiscountPercent: number;
  threeUpPlayDiscountPercent: number;
  twoUpPlayDiscountPercent: number;
  twoDownPlayDiscountPercent: number;
  threeUpSingleDigitPlayDiscountPercent: number;
  twoUpSingleDigitPlayDiscountPercent: number;
  twoDownSingleDigitPlayDiscountPercent: number;
  threeUpGameTotalPlayDiscountPercent: number;
  twoUpGameTotalPlayDiscountPercent: number;
  twoDownGameTotalPlayDiscountPercent: number;
  // Special Discounts
  firstPrizePlaySpecialDiscountPercent: number;
  threeUpPlaySpecialDiscountPercent: number;
  twoUpPlaySpecialDiscountPercent: number;
  twoDownPlaySpecialDiscountPercent: number;
  threeUpSingleDigitPlaySpecialDiscountPercent: number;
  twoUpSingleDigitPlaySpecialDiscountPercent: number;
  twoDownSingleDigitPlaySpecialDiscountPercent: number;
  threeUpGameTotalPlaySpecialDiscountPercent: number;
  twoUpGameTotalPlaySpecialDiscountPercent: number;
  twoDownGameTotalPlaySpecialDiscountPercent: number;
  // Last Day Discounts
  firstPrizePlayLastDayDiscountPercent: number;
  threeUpPlayLastDayDiscountPercent: number;
  twoUpPlayLastDayDiscountPercent: number;
  twoDownPlayLastDayDiscountPercent: number;
  threeUpSingleDigitPlayLastDayDiscountPercent: number;
  twoUpSingleDigitPlayLastDayDiscountPercent: number;
  twoDownSingleDigitPlayLastDayDiscountPercent: number;
  threeUpGameTotalPlayLastDayDiscountPercent: number;
  twoUpGameTotalPlayLastDayDiscountPercent: number;
  twoDownGameTotalPlayLastDayDiscountPercent: number;
  // Winnings
  firstPrizeStraightWinningPercent: number;
  firstPrizeRumbleWinningPercent: number;
  threeUpStraightWinningPercent: number;
  threeUpRumbleWinningPercent: number;
  twoUpWinningPercent: number;
  twoDownWinningPercent: number;
  threeUpSingleDigitWinningPercent: number;
  twoUpSingleDigitWinningPercent: number;
  twoDownSingleDigitWinningPercent: number;
  threeUpTotalWinningPercent: number;
  twoUpTotalWinningPercent: number;
  twoDownTotalWinningPercent: number;
}

interface LotteryGamePermission {
  _id: string;
  lotteryGameType: number;
  isAvailableLotteryGame: boolean;
  canPlayLotteryGame: boolean;
  removePlayDiscountOnLastDay: boolean;
  enableLastDayDiscounts: boolean;
  showGameWinnersListScroll: boolean;
  isAvailableSingleDigitGame: boolean;
  isAvailableGameTotal: boolean;
}

const GameSettings: React.FC = () => {
  const { api, notification } = useStore();
  const [activeTab, setActiveTab] = useState('general');
  const [selectedGameType, setSelectedGameType] = useState(1);
  const [settings, setSettings] = useState<LotteryGameSetting | null>(null);
  const [permissions, setPermissions] = useState<LotteryGamePermission | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const gameTypes = [
    { id: 1, name: 'Thailand Lottery', color: 'bg-red-500' },
    { id: 2, name: 'Bangkok Weekly', color: 'bg-blue-500' },
    { id: 3, name: 'Dubai Daily', color: 'bg-green-500' },
    { id: 4, name: 'London Weekly', color: 'bg-purple-500' },
    { id: 5, name: 'Mexico Monthly', color: 'bg-yellow-500' }
  ];

  const tabs = [
    { id: 'general', name: 'General Settings', icon: Cog6ToothIcon },
    { id: 'permissions', name: 'Permissions', icon: ShieldCheckIcon },
    { id: 'discounts', name: 'Discounts', icon: CurrencyDollarIcon },
    { id: 'winnings', name: 'Winnings', icon: TrophyIcon },
    { id: 'board', name: 'Game Board', icon: ClipboardDocumentListIcon }
  ];

  useEffect(() => {
    loadGameData();
  }, [selectedGameType]);

  const loadGameData = async () => {
    setLoading(true);
    try {
      const [settingsRes, permissionsRes] = await Promise.all([
        api.getLotteryGameSettings(),
        api.getLotteryGamePermissions()
      ]);

      const currentSettings = settingsRes.data?.find((s: LotteryGameSetting) => s.lotteryGameType === selectedGameType);
      const currentPermissions = permissionsRes.data?.find((p: LotteryGamePermission) => p.lotteryGameType === selectedGameType);

      setSettings(currentSettings || null);
      setPermissions(currentPermissions || null);
    } catch (error) {
      notification.show('Failed to load game data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const initializeGameSettings = async () => {
    setInitializing(true);
    try {
      await api.initializeLotterySettings(selectedGameType);
      await api.initializeLotteryPermissions(selectedGameType);
      await loadGameData();
      notification.show('Game settings initialized successfully', 'success');
    } catch (error) {
      notification.show('Failed to initialize game settings', 'error');
    } finally {
      setInitializing(false);
    }
  };

  const updateGeneralSettings = async (data: Partial<LotteryGameSetting>) => {
    if (!settings?._id) return;
    
    try {
      await api.updateLotteryGameSetting(settings._id, data);
      await loadGameData();
      notification.show('General settings updated successfully', 'success');
    } catch (error) {
      notification.show('Failed to update general settings', 'error');
    }
  };

  const updatePermissions = async (field: string, value: boolean) => {
    if (!permissions?._id) return;
    
    try {
      await api.updateLotteryGamePermission(permissions._id, { [field]: value });
      await loadGameData();
      notification.show('Permissions updated successfully', 'success');
    } catch (error) {
      notification.show('Failed to update permissions', 'error');
    }
  };

  const updateDiscounts = async (data: Partial<LotteryGameSetting>) => {
    if (!settings?._id) return;
    
    try {
      await api.updateLotteryGameSetting(settings._id, data);
      await loadGameData();
      notification.show('Discounts updated successfully', 'success');
    } catch (error) {
      notification.show('Failed to update discounts', 'error');
    }
  };

  const updateWinnings = async (data: Partial<LotteryGameSetting>) => {
    if (!settings?._id) return;
    
    try {
      await api.updateLotteryGameSetting(settings._id, data);
      await loadGameData();
      notification.show('Winnings updated successfully', 'success');
    } catch (error) {
      notification.show('Failed to update winnings', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!settings || !permissions) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="mx-auto h-24 w-24 text-yellow-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Game Settings Not Found</h3>
            <p className="mt-2 text-sm text-gray-500">
              The game settings for this lottery type have not been initialized yet.
            </p>
            <button
              onClick={initializeGameSettings}
              disabled={initializing}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {initializing ? 'Initializing...' : 'Initialize Settings'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Game Settings</h1>
          <p className="mt-2 text-gray-600">Manage lottery game configurations and rules</p>
        </div>

        {/* Game Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Lottery Game Type</label>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {gameTypes.map((game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGameType(game.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedGameType === game.id
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${game.color} mx-auto mb-2`}></div>
                <div className="text-sm font-medium">{game.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'general' && (
            <GeneralSettingsTab 
              settings={settings} 
              onUpdate={updateGeneralSettings} 
            />
          )}
          {activeTab === 'permissions' && (
            <PermissionsTab 
              permissions={permissions} 
              onUpdate={updatePermissions} 
            />
          )}
          {activeTab === 'discounts' && (
            <DiscountsTab 
              settings={settings} 
              onUpdate={updateDiscounts} 
            />
          )}
          {activeTab === 'winnings' && (
            <WinningsTab 
              settings={settings} 
              onUpdate={updateWinnings} 
            />
          )}
          {activeTab === 'board' && (
            <GameBoardTab 
              gameType={selectedGameType} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

// General Settings Tab Component
const GeneralSettingsTab: React.FC<{
  settings: LotteryGameSetting;
  onUpdate: (data: Partial<LotteryGameSetting>) => void;
}> = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState({
    gameStopHour: settings.gameStopHour,
    gameDiscountStopHour: settings.gameDiscountStopHour,
    minimumAmountForPlay: settings.minimumAmountForPlay,
    agentCommissionInPercent: settings.agentCommissionInPercent,
    lotteryGameDrawDates: settings.lotteryGameDrawDates || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">General Settings</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Game Stop Hour (HH:MM)
            </label>
            <input
              type="text"
              value={formData.gameStopHour}
              onChange={(e) => setFormData({ ...formData, gameStopHour: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="8:30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Stop Hour (HH:MM)
            </label>
            <input
              type="text"
              value={formData.gameDiscountStopHour}
              onChange={(e) => setFormData({ ...formData, gameDiscountStopHour: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="5:0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Amount for Play
            </label>
            <input
              type="number"
              value={formData.minimumAmountForPlay}
              onChange={(e) => setFormData({ ...formData, minimumAmountForPlay: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Commission (%)
            </label>
            <input
              type="number"
              value={formData.agentCommissionInPercent}
              onChange={(e) => setFormData({ ...formData, agentCommissionInPercent: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Game Draw Dates (comma separated)
          </label>
          <input
            type="text"
            value={formData.lotteryGameDrawDates}
            onChange={(e) => setFormData({ ...formData, lotteryGameDrawDates: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="1,16"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Update Settings
          </button>
        </div>
      </form>
    </div>
  );
};

// Permissions Tab Component
const PermissionsTab: React.FC<{
  permissions: LotteryGamePermission;
  onUpdate: (field: string, value: boolean) => void;
}> = ({ permissions, onUpdate }) => {
  const permissionItems = [
    { key: 'isAvailableLotteryGame', label: 'Game Available', description: 'Enable/disable the lottery game' },
    { key: 'canPlayLotteryGame', label: 'Running Lottery Game', description: 'Allow users to play the game' },
    { key: 'enableLastDayDiscounts', label: 'Enable Last Day Discounts', description: 'Show last day discount options' },
    { key: 'showGameWinnersListScroll', label: 'Show Winners List Scroller', description: 'Display winners list on frontend' },
    { key: 'isAvailableSingleDigitGame', label: 'Single Digit Game Available', description: 'Enable single digit game options' },
    { key: 'isAvailableGameTotal', label: 'Game Total Available', description: 'Enable game total options' }
  ];

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Game Permissions</h3>
      <div className="space-y-4">
        {permissionItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{item.label}</h4>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <button
              onClick={() => onUpdate(item.key, !permissions[item.key as keyof LotteryGamePermission] as boolean)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                permissions[item.key as keyof LotteryGamePermission] as boolean
                  ? 'bg-green-600'
                  : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  permissions[item.key as keyof LotteryGamePermission] as boolean
                    ? 'translate-x-6'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Discounts Tab Component
const DiscountsTab: React.FC<{
  settings: LotteryGameSetting;
  onUpdate: (data: Partial<LotteryGameSetting>) => void;
}> = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstPrizePlayDiscountPercent: settings.firstPrizePlayDiscountPercent,
    threeUpPlayDiscountPercent: settings.threeUpPlayDiscountPercent,
    twoUpPlayDiscountPercent: settings.twoUpPlayDiscountPercent,
    twoDownPlayDiscountPercent: settings.twoDownPlayDiscountPercent,
    threeUpSingleDigitPlayDiscountPercent: settings.threeUpSingleDigitPlayDiscountPercent,
    twoUpSingleDigitPlayDiscountPercent: settings.twoUpSingleDigitPlayDiscountPercent,
    twoDownSingleDigitPlayDiscountPercent: settings.twoDownSingleDigitPlayDiscountPercent,
    threeUpGameTotalPlayDiscountPercent: settings.threeUpGameTotalPlayDiscountPercent,
    twoUpGameTotalPlayDiscountPercent: settings.twoUpGameTotalPlayDiscountPercent,
    twoDownGameTotalPlayDiscountPercent: settings.twoDownGameTotalPlayDiscountPercent
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const discountFields = [
    { key: 'firstPrizePlayDiscountPercent', label: 'First Prize Discount (%)' },
    { key: 'threeUpPlayDiscountPercent', label: 'Three Up Discount (%)' },
    { key: 'twoUpPlayDiscountPercent', label: 'Two Up Discount (%)' },
    { key: 'twoDownPlayDiscountPercent', label: 'Two Down Discount (%)' },
    { key: 'threeUpSingleDigitPlayDiscountPercent', label: 'Three Up Single Digit Discount (%)' },
    { key: 'twoUpSingleDigitPlayDiscountPercent', label: 'Two Up Single Digit Discount (%)' },
    { key: 'twoDownSingleDigitPlayDiscountPercent', label: 'Two Down Single Digit Discount (%)' },
    { key: 'threeUpGameTotalPlayDiscountPercent', label: 'Three Up Game Total Discount (%)' },
    { key: 'twoUpGameTotalPlayDiscountPercent', label: 'Two Up Game Total Discount (%)' },
    { key: 'twoDownGameTotalPlayDiscountPercent', label: 'Two Down Game Total Discount (%)' }
  ];

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Play Discounts</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {discountFields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData[field.key as keyof typeof formData]}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  [field.key]: Number(e.target.value) 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Update Discounts
          </button>
        </div>
      </form>
    </div>
  );
};

// Winnings Tab Component
const WinningsTab: React.FC<{
  settings: LotteryGameSetting;
  onUpdate: (data: Partial<LotteryGameSetting>) => void;
}> = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstPrizeStraightWinningPercent: settings.firstPrizeStraightWinningPercent,
    firstPrizeRumbleWinningPercent: settings.firstPrizeRumbleWinningPercent,
    threeUpStraightWinningPercent: settings.threeUpStraightWinningPercent,
    threeUpRumbleWinningPercent: settings.threeUpRumbleWinningPercent,
    twoUpWinningPercent: settings.twoUpWinningPercent,
    twoDownWinningPercent: settings.twoDownWinningPercent,
    threeUpSingleDigitWinningPercent: settings.threeUpSingleDigitWinningPercent,
    twoUpSingleDigitWinningPercent: settings.twoUpSingleDigitWinningPercent,
    twoDownSingleDigitWinningPercent: settings.twoDownSingleDigitWinningPercent,
    threeUpTotalWinningPercent: settings.threeUpTotalWinningPercent,
    twoUpTotalWinningPercent: settings.twoUpTotalWinningPercent,
    twoDownTotalWinningPercent: settings.twoDownTotalWinningPercent
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const winningFields = [
    { key: 'firstPrizeStraightWinningPercent', label: 'First Prize Straight (%)' },
    { key: 'firstPrizeRumbleWinningPercent', label: 'First Prize Rumble (%)' },
    { key: 'threeUpStraightWinningPercent', label: 'Three Up Straight (%)' },
    { key: 'threeUpRumbleWinningPercent', label: 'Three Up Rumble (%)' },
    { key: 'twoUpWinningPercent', label: 'Two Up (%)' },
    { key: 'twoDownWinningPercent', label: 'Two Down (%)' },
    { key: 'threeUpSingleDigitWinningPercent', label: 'Three Up Single Digit (%)' },
    { key: 'twoUpSingleDigitWinningPercent', label: 'Two Up Single Digit (%)' },
    { key: 'twoDownSingleDigitWinningPercent', label: 'Two Down Single Digit (%)' },
    { key: 'threeUpTotalWinningPercent', label: 'Three Up Total (%)' },
    { key: 'twoUpTotalWinningPercent', label: 'Two Up Total (%)' },
    { key: 'twoDownTotalWinningPercent', label: 'Two Down Total (%)' }
  ];

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Winning Percentages</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {winningFields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData[field.key as keyof typeof formData]}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  [field.key]: Number(e.target.value) 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Update Winnings
          </button>
        </div>
      </form>
    </div>
  );
};

// Game Board Tab Component
const GameBoardTab: React.FC<{ gameType: number }> = ({ gameType }) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Game Board Management</h3>
      <div className="text-center py-12">
        <ClipboardDocumentListIcon className="mx-auto h-24 w-24 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Game Board Management</h3>
        <p className="mt-2 text-sm text-gray-500">
          Manage lottery game board configurations and number ranges.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          This feature will be implemented in the next update.
        </p>
      </div>
    </div>
  );
};

export default GameSettings; 