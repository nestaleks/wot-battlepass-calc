# Руководство по созданию мода Battle Pass Calculator для World of Tanks

## Обзор

Для создания мода Battle Pass Calculator для World of Tanks необходимо изучить архитектуру игры, API модификаций и интеграцию с игровым интерфейсом.

## Архитектура World of Tanks

### Игровой движок
- **BigWorld Engine** - основной движок игры
- **Python 2.7** - скриптовый язык для логики
- **ActionScript 3 (Flash)** - интерфейс пользователя
- **Scaleform** - система рендеринга UI

### Структура клиента
```
World_of_Tanks/
├── res/
│   ├── scripts/          # Python скрипты
│   ├── gui/             # Интерфейс
│   └── packages/        # Ресурсы
├── mods/                # Папка модов
└── res_mods/           # Ресурсы модов
```

## Типы модов для WoT

### 1. Python моды
- Логика и функциональность
- Доступ к игровым данным
- Обработка событий

### 2. Flash/ActionScript моды
- Модификация интерфейса
- Новые окна и панели
- Визуальные элементы

### 3. Комбинированные моды
- Python для логики
- Flash для интерфейса

## Необходимые инструменты

### Для Python разработки
- **Python 2.7** (совместимость с игрой)
- **PyCharm** или другая IDE
- **WoT Decompiler** для изучения кода игры
- **mod_asyncore** для отладки

### Для Flash разработки
- **Adobe Flash Professional** или **Apache Flex**
- **ActionScript 3** компилятор
- **JPEXS Flash Decompiler** для изучения интерфейса

### Дополнительные инструменты
- **WoT ModPack Station** для тестирования
- **Python Beautifier** для читаемости кода
- **Git** для версионирования

## Структура мода Battle Pass Calculator

### Папочная структура
```
mods/
└── 1.x.x.x/           # Версия WoT
    └── battle_pass_calc/
        ├── __init__.py
        ├── mod_battle_pass_calc.py
        ├── gui/
        │   ├── flash/
        │   │   └── calculator_panel.swf
        │   └── scaleform/
        │       └── calculator_view.py
        ├── data/
        │   ├── battle_pass_config.json
        │   └── translations.json
        └── utils/
            ├── calculator.py
            └── storage.py
```

## Основные компоненты мода

### 1. Главный модуль (mod_battle_pass_calc.py)
```python
import BigWorld
from gui.Scaleform.framework import g_entitiesFactories
from gui.app_loader import g_appLoader

class BattlePassCalculatorMod:
    def __init__(self):
        self.is_loaded = False
        self.calculator_view = None
    
    def init(self):
        # Инициализация мода
        self.register_handlers()
        self.load_config()
        
    def register_handlers(self):
        # Регистрация обработчиков событий
        pass
```

### 2. Интерфейсный компонент (calculator_view.py)
```python
from gui.Scaleform.framework.entities.View import View
from gui.Scaleform.framework.entities.abstract.AbstractWindowView import AbstractWindowView

class BattlePassCalculatorView(AbstractWindowView):
    def __init__(self):
        super(BattlePassCalculatorView, self).__init__()
        
    def _populate(self):
        # Заполнение интерфейса данными
        pass
        
    def calculate_progress(self, chapter, stage, points):
        # Логика расчета прогресса
        pass
```

### 3. Логика расчетов (calculator.py)
```python
import json
from datetime import datetime, timedelta

class BattlePassCalculator:
    def __init__(self, config_path):
        self.config = self.load_config(config_path)
        
    def calculate_progress(self, chapter, stage, stage_points):
        # Адаптация логики из веб-версии
        total_points = self.get_total_points(chapter, stage, stage_points)
        remaining_points = self.config['total_points'] - total_points
        # ... остальная логика
        
    def get_expected_progress(self):
        # Расчет ожидаемого прогресса
        pass
```

### 4. Система хранения (storage.py)
```python
import pickle
import os

class ProgressStorage:
    def __init__(self):
        self.storage_path = './mods/battle_pass_history.dat'
        
    def save_progress(self, data):
        with open(self.storage_path, 'wb') as f:
            pickle.dump(data, f)
            
    def load_progress(self):
        if os.path.exists(self.storage_path):
            with open(self.storage_path, 'rb') as f:
                return pickle.load(f)
        return []
```

## Flash интерфейс (ActionScript 3)

### Главная панель (calculator_panel.as)
```actionscript
package {
    import flash.display.MovieClip;
    import flash.events.Event;
    import flash.events.MouseEvent;
    
    public class CalculatorPanel extends MovieClip {
        public var chapterInput:TextInput;
        public var stageInput:TextInput;
        public var pointsInput:TextInput;
        public var calculateBtn:Button;
        public var resultsText:TextField;
        
        public function CalculatorPanel() {
            addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
        }
        
        private function onAddedToStage(event:Event):void {
            calculateBtn.addEventListener(MouseEvent.CLICK, onCalculate);
        }
        
        private function onCalculate(event:MouseEvent):void {
            // Вызов Python функции через ExternalInterface
            ExternalInterface.call("battlePassMod.calculate", 
                chapterInput.text, stageInput.text, pointsInput.text);
        }
    }
}
```

## Интеграция с игрой

### 1. Регистрация в игровом GUI
```python
# В главном модуле
from gui.Scaleform.framework import ScopeTemplates
from gui.Scaleform.framework.managers.loaders import SFViewLoadParams

def register_view():
    g_entitiesFactories.addSettings(
        ViewSettings('battlePassCalculator', 
                    BattlePassCalculatorView, 
                    'battle_pass_calculator.swf', 
                    ViewTypes.WINDOW,
                    ScopeTemplates.DEFAULT_SCOPE)
    )
```

### 2. Добавление кнопки в игровое меню
```python
# Хук в главное меню
def add_menu_button():
    # Добавление кнопки в интерфейс ангара
    pass
```

### 3. Обработка игровых событий
```python
from gui.shared import g_eventBus
from gui.shared.events import GameEvent

def on_battle_pass_updated(event):
    # Обновление данных при изменении прогресса
    calculator_view.update_data(event.ctx)

g_eventBus.addListener(GameEvent.BATTLE_PASS_UPDATED, on_battle_pass_updated)
```

## Получение данных из игры

### Доступ к Battle Pass API
```python
from gui.game_control import g_gameCtrl
from gui.server_events.battle_pass_controller import BattlePassController

def get_current_progress():
    bp_controller = g_gameCtrl.battlePassController
    if bp_controller:
        return {
            'chapter': bp_controller.getCurrentChapter(),
            'stage': bp_controller.getCurrentStage(), 
            'points': bp_controller.getCurrentPoints()
        }
    return None
```

### Мониторинг изменений
```python
class BattlePassMonitor:
    def __init__(self):
        self.last_data = None
        
    def update(self):
        current_data = get_current_progress()
        if current_data != self.last_data:
            self.on_progress_changed(current_data)
            self.last_data = current_data
            
    def on_progress_changed(self, data):
        # Обновление интерфейса калькулятора
        pass
```

## Локализация

### Структура переводов (translations.json)
```json
{
    "en": {
        "calculator_title": "Battle Pass Calculator",
        "chapter_label": "Chapter:",
        "stage_label": "Stage:",
        "calculate_btn": "Calculate"
    },
    "ru": {
        "calculator_title": "Калькулятор Боевого пропуска",
        "chapter_label": "Глава:",
        "stage_label": "Этап:",
        "calculate_btn": "Рассчитать"
    }
}
```

### Система переводов
```python
import json

class Localization:
    def __init__(self):
        self.current_lang = 'en'
        self.translations = self.load_translations()
        
    def get_text(self, key):
        return self.translations.get(self.current_lang, {}).get(key, key)
```

## Настройка и конфигурация

### Конфигурационный файл (battle_pass_config.json)
```json
{
    "total_points": 7500,
    "points_per_stage": 50,
    "stages_per_chapter": 50,
    "chapters_total": 3,
    "start_date": "2026-03-04",
    "end_date": "2026-06-02",
    "auto_update": true,
    "show_in_battle": false,
    "hotkey": "F11"
}
```

## Установка и распространение

### Формат пакета
```
battle_pass_calculator_v1.0.wotmod
├── meta.xml
├── mod_battle_pass_calc.py
├── gui/
├── data/
└── utils/
```

### meta.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<root>
    <id>battle.pass.calculator</id>
    <version>1.0.0</version>
    <name>Battle Pass Calculator</name>
    <description>Calculate your Battle Pass progress</description>
    <author>YourName</author>
    <date>2026-03-01</date>
</root>
```

## Совместимость и обновления

### Система версий
- Каждая версия WoT требует отдельной папки мода
- Автоматическое определение версии игры
- Миграция настроек между версиями

### Обработка обновлений игры
```python
def check_compatibility():
    game_version = BigWorld.wg_getProductVersion()
    mod_version = get_mod_supported_versions()
    
    if game_version not in mod_version:
        show_compatibility_warning()
```

## Тестирование и отладка

### Локальное тестирование
1. Копирование файлов в папку `mods/`
2. Запуск игры в оконном режиме
3. Проверка логов в `python.log`

### Отладочные инструменты
```python
import traceback
import logging

logger = logging.getLogger('BattlePassCalculator')
logger.setLevel(logging.DEBUG)

def safe_execute(func):
    try:
        return func()
    except Exception as e:
        logger.error(f"Error in {func.__name__}: {e}")
        logger.error(traceback.format_exc())
```

## Безопасность и ограничения

### Разрешенные операции
- ✅ Чтение игровой статистики
- ✅ Модификация интерфейса
- ✅ Локальное хранение данных
- ✅ Математические расчеты

### Запрещенные операции
- ❌ Изменение игрового баланса
- ❌ Автоматизация действий
- ❌ Обход игровых ограничений
- ❌ Сетевые запросы к сторонним серверам

## Ресурсы и документация

### Официальные ресурсы
- [WoT Modding Portal](https://worldoftanks.eu/en/content/guide/general/mods/)
- [BigWorld Documentation](https://docs.bigworldtech.com/)

### Сообщество модификаций
- [WoT Mods Portal](https://wgmods.net/)
- [ModXVM](https://modxvm.com/)
- [Reddit /r/WorldofTanks](https://reddit.com/r/WorldofTanks)

### Инструменты разработки
- [WoT Mod Tools](https://github.com/StranikS-Scan/WOT-ModTools)
- [Battle Pass API Documentation](https://developers.wargaming.net/)

## Заключение

Создание мода Battle Pass Calculator для World of Tanks требует:

1. **Знания Python 2.7** и ActionScript 3
2. **Понимания архитектуры** BigWorld Engine
3. **Опыта работы** с игровыми API
4. **Навыков интеграции** с существующим интерфейсом
5. **Тестирования совместимости** с различными версиями игры

Данный мод значительно расширит функциональность игры, предоставив игрокам удобный инструмент для планирования прогресса в Боевом пропуске.