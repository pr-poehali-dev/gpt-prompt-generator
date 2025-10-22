import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  template: string;
  isFavorite?: boolean;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('generator');
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [savedPrompts, setSavedPrompts] = useState<PromptTemplate[]>([]);

  const promptTemplates: PromptTemplate[] = [
    {
      id: '1',
      title: 'Копирайтинг для соцсетей',
      category: 'Маркетинг',
      description: 'Создание постов для Instagram, Facebook, VK',
      template: 'Создай пост для [соцсеть] на тему [тема]. Целевая аудитория: [аудитория]. Тон: [дружелюбный/профессиональный/вдохновляющий]. Добавь 3-5 хештегов.',
    },
    {
      id: '2',
      title: 'Анализ кода',
      category: 'Программирование',
      description: 'Проверка и улучшение кода',
      template: 'Проанализируй следующий код на [язык программирования]: [код]. Найди возможные ошибки, предложи оптимизации и улучшения по читаемости.',
    },
    {
      id: '3',
      title: 'Генерация идей',
      category: 'Креатив',
      description: 'Мозговой штурм и творческие идеи',
      template: 'Предложи 10 креативных идей для [проект/бизнес/контент] в нише [ниша]. Учитывай тренды 2025 года и интересы [целевая аудитория].',
    },
    {
      id: '4',
      title: 'Email-рассылка',
      category: 'Маркетинг',
      description: 'Письма для email-маркетинга',
      template: 'Напиши продающее email-письмо для [продукт/услуга]. Тема письма должна быть цепляющей. Включи призыв к действию и персонализацию для [сегмент аудитории].',
    },
    {
      id: '5',
      title: 'Обучающий контент',
      category: 'Образование',
      description: 'Объяснение сложных тем простым языком',
      template: 'Объясни [сложная тема] простыми словами для [уровень: начинающий/средний/продвинутый]. Используй аналогии и примеры из жизни. Добавь практические советы.',
    },
    {
      id: '6',
      title: 'SEO-оптимизация',
      category: 'Маркетинг',
      description: 'Тексты для поисковой оптимизации',
      template: 'Создай SEO-оптимизированный текст на тему [тема] длиной [количество слов]. Ключевые слова: [список ключевых слов]. Включи подзаголовки H2 и H3.',
    },
    {
      id: '7',
      title: 'Создание персонажа',
      category: 'Креатив',
      description: 'Разработка персонажа для истории',
      template: 'Создай детального персонажа для [жанр: фэнтези/sci-fi/детектив]. Опиши внешность, характер, мотивацию, предысторию и особенности речи. Возраст: [возраст].',
    },
    {
      id: '8',
      title: 'Резюме навыков',
      category: 'Карьера',
      description: 'Описание профессиональных навыков',
      template: 'Составь профессиональное описание навыков для резюме. Должность: [должность]. Опыт работы: [количество лет]. Ключевые достижения: [достижения]. Стиль: краткий и конкретный.',
    },
  ];

  const categories = Array.from(new Set(promptTemplates.map(p => p.category)));

  const filteredTemplates = promptTemplates.filter(template =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoritePrompts = savedPrompts.filter(p => p.isFavorite);

  const handleCopyPrompt = (template: string) => {
    navigator.clipboard.writeText(template);
    toast.success('Промт скопирован в буфер обмена!');
  };

  const handleSavePrompt = (prompt: PromptTemplate) => {
    if (!savedPrompts.find(p => p.id === prompt.id)) {
      setSavedPrompts([...savedPrompts, prompt]);
      toast.success('Промт сохранён в библиотеку!');
    } else {
      toast.info('Промт уже в библиотеке');
    }
  };

  const toggleFavorite = (id: string) => {
    setSavedPrompts(savedPrompts.map(p =>
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    ));
    toast.success('Избранное обновлено');
  };

  const handleGenerateCustom = () => {
    if (customPrompt.trim()) {
      const newPrompt: PromptTemplate = {
        id: Date.now().toString(),
        title: 'Пользовательский промт',
        category: 'Пользовательские',
        description: customPrompt.substring(0, 50) + '...',
        template: customPrompt,
      };
      setSavedPrompts([...savedPrompts, newPrompt]);
      toast.success('Промт создан и сохранён!');
      setCustomPrompt('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/20 to-green-50/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-6 shadow-lg">
            <Icon name="Sparkles" size={32} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            Генератор Промтов
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Готовые шаблоны промтов для ChatGPT. Создавай, сохраняй и используй лучшие промты для любых задач
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto h-14 p-1 bg-white/80 backdrop-blur shadow-sm">
            <TabsTrigger value="generator" className="flex items-center gap-2 data-[state=active]:gradient-primary data-[state=active]:text-white">
              <Icon name="Sparkles" size={18} />
              <span className="hidden sm:inline">Генератор</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2 data-[state=active]:gradient-primary data-[state=active]:text-white">
              <Icon name="Library" size={18} />
              <span className="hidden sm:inline">Библиотека</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2 data-[state=active]:gradient-primary data-[state=active]:text-white">
              <Icon name="Heart" size={18} />
              <span className="hidden sm:inline">Избранное</span>
            </TabsTrigger>
            <TabsTrigger value="help" className="flex items-center gap-2 data-[state=active]:gradient-primary data-[state=active]:text-white">
              <Icon name="HelpCircle" size={18} />
              <span className="hidden sm:inline">Помощь</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6 animate-fade-in">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl">Создать свой промт</CardTitle>
                <CardDescription>Напиши собственный промт или используй готовые шаблоны</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Опиши свою задачу для ChatGPT..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[120px] text-base"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleGenerateCustom}
                    className="gradient-primary hover:opacity-90 transition-opacity"
                    disabled={!customPrompt.trim()}
                  >
                    <Icon name="Plus" size={18} className="mr-2" />
                    Создать и сохранить
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleCopyPrompt(customPrompt)}
                    disabled={!customPrompt.trim()}
                  >
                    <Icon name="Copy" size={18} className="mr-2" />
                    Копировать
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Готовые шаблоны</h2>
                <Input
                  placeholder="Поиск шаблонов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Badge key={category} variant="secondary" className="text-sm px-4 py-2 cursor-pointer hover:scale-105 transition-transform">
                    {category}
                  </Badge>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-0 bg-white/90 backdrop-blur"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-tight">{template.title}</CardTitle>
                      <CardDescription className="text-sm">{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-muted/50 p-3 rounded-lg text-sm text-muted-foreground line-clamp-3">
                        {template.template}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyPrompt(template.template);
                          }}
                          className="flex-1 gradient-primary hover:opacity-90"
                        >
                          <Icon name="Copy" size={16} className="mr-1" />
                          Копировать
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSavePrompt(template);
                          }}
                        >
                          <Icon name="Save" size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="library" className="animate-fade-in">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl">Моя библиотека</CardTitle>
                <CardDescription>Все сохранённые промты в одном месте</CardDescription>
              </CardHeader>
              <CardContent>
                {savedPrompts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="Library" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Пока нет сохранённых промтов</p>
                    <p className="text-sm">Сохраняйте промты из генератора для быстрого доступа</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {savedPrompts.map((prompt) => (
                      <Card key={prompt.id} className="border bg-white hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Badge variant="outline" className="text-xs mb-2">
                                {prompt.category}
                              </Badge>
                              <CardTitle className="text-base">{prompt.title}</CardTitle>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleFavorite(prompt.id)}
                            >
                              <Icon
                                name="Heart"
                                size={18}
                                className={prompt.isFavorite ? 'fill-red-500 text-red-500' : ''}
                              />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="bg-muted/50 p-3 rounded text-sm line-clamp-4">
                            {prompt.template}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleCopyPrompt(prompt.template)}
                            className="w-full gradient-primary hover:opacity-90"
                          >
                            <Icon name="Copy" size={16} className="mr-2" />
                            Копировать
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="animate-fade-in">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="Heart" size={24} className="text-red-500" />
                  Избранное
                </CardTitle>
                <CardDescription>Быстрый доступ к любимым промтам</CardDescription>
              </CardHeader>
              <CardContent>
                {favoritePrompts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="Heart" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Нет избранных промтов</p>
                    <p className="text-sm">Добавляйте промты в избранное из библиотеки</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {favoritePrompts.map((prompt) => (
                      <Card key={prompt.id} className="border bg-gradient-to-br from-red-50 to-pink-50 hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Badge variant="outline" className="text-xs mb-2">
                                {prompt.category}
                              </Badge>
                              <CardTitle className="text-base">{prompt.title}</CardTitle>
                            </div>
                            <Icon name="Heart" size={18} className="fill-red-500 text-red-500" />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="bg-white/60 p-3 rounded text-sm line-clamp-4">
                            {prompt.template}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleCopyPrompt(prompt.template)}
                            className="w-full gradient-primary hover:opacity-90"
                          >
                            <Icon name="Copy" size={16} className="mr-2" />
                            Копировать
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="help" className="animate-fade-in">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl">Как создавать эффективные промты</CardTitle>
                <CardDescription>Советы и рекомендации по работе с ChatGPT</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Будьте конкретны</h3>
                      <p className="text-sm text-muted-foreground">
                        Чем точнее вы опишете задачу, тем лучше результат. Указывайте формат, объём, стиль и целевую аудиторию.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Задавайте контекст</h3>
                      <p className="text-sm text-muted-foreground">
                        Объясните ChatGPT роль, которую он должен играть: "Ты опытный маркетолог", "Ты профессиональный программист".
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Используйте примеры</h3>
                      <p className="text-sm text-muted-foreground">
                        Покажите желаемый формат ответа через примеры. Это поможет ChatGPT лучше понять ваши ожидания.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Разбивайте сложные задачи</h3>
                      <p className="text-sm text-muted-foreground">
                        Большие задачи делите на несколько простых промтов. Это даст более качественный результат.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">5</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Итерируйте и улучшайте</h3>
                      <p className="text-sm text-muted-foreground">
                        Не бойтесь уточнять и переспрашивать. Доработка промта часто даёт лучший результат, чем первая попытка.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-purple-50 p-6 rounded-lg border border-green-200/50">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Icon name="Lightbulb" size={20} className="text-yellow-600" />
                    Пример хорошего промта
                  </h3>
                  <p className="text-sm bg-white/80 p-4 rounded border italic">
                    "Ты опытный копирайтер. Создай пост для Instagram длиной 150-200 слов на тему здорового питания.
                    Целевая аудитория — женщины 25-35 лет, интересующиеся ЗОЖ. Тон: дружелюбный и мотивирующий.
                    Добавь призыв к действию и 5 релевантных хештегов."
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
