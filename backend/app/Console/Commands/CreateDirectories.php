<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class CreateDirectories extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-directories';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create all necessary Laravel directories';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $directories = [
            storage_path('app/public'),
            storage_path('framework/cache'),
            storage_path('framework/sessions'),
            storage_path('framework/views'),
            storage_path('logs'),
            base_path('bootstrap/cache'),
            resource_path('views'),
        ];

        foreach ($directories as $directory) {
            if (!File::exists($directory)) {
                File::makeDirectory($directory, 0755, true);
                $this->info("Created: {$directory}");
            } else {
                $this->line("Already exists: {$directory}");
            }
        }

        $this->info('All required directories have been created.');
    }
} 