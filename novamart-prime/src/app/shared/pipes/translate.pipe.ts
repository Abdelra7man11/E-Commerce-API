import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Enables instant reactive re-evaluation when signal changes without reloading
})
export class TranslatePipe implements PipeTransform {
  private languageService = inject(LanguageService);

  transform(key: string, fallback?: string): string {
    return this.languageService.t(key, fallback);
  }
}
