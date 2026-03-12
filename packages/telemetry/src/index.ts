import {
  DiagConsoleLogger,
  DiagLogLevel,
  diag,
  SpanStatusCode,
  trace,
} from '@opentelemetry/api'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
} from '@opentelemetry/sdk-trace-base'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

type TraceAttributes = Record<string, string | number | boolean | undefined>

let registered = false
let currentServiceName = 'questlog'

const filterAttributes = (attributes: TraceAttributes) =>
  Object.fromEntries(
    Object.entries(attributes).filter(([, value]) => value !== undefined),
  ) as Record<string, string | number | boolean>

export const registerTelemetry = (serviceName = 'questlog') => {
  currentServiceName = serviceName

  if (registered) {
    return
  }

  if (process.env.OTEL_DEBUG === 'true') {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO)
  }

  const spanProcessors = process.env.OTEL_EXPORTER_OTLP_ENDPOINT
    ? [
        new BatchSpanProcessor(
          new OTLPTraceExporter({
            url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
          }),
        ),
      ]
    : process.env.NODE_ENV !== 'test'
      ? [new BatchSpanProcessor(new ConsoleSpanExporter())]
      : []

  const provider = new NodeTracerProvider({
    resource: resourceFromAttributes({
      [SEMRESATTRS_SERVICE_NAME]: serviceName,
    }),
    spanProcessors,
  })

  provider.register()
  registered = true
}

export const traceAsync = async <T>(
  name: string,
  attributes: TraceAttributes,
  run: () => Promise<T>,
) => {
  registerTelemetry(currentServiceName)

  const tracer = trace.getTracer(currentServiceName)

  return tracer.startActiveSpan(
    name,
    { attributes: filterAttributes(attributes) },
    async (span) => {
      try {
        const result = await run()
        span.setStatus({ code: SpanStatusCode.OK })
        return result
      } catch (error) {
        span.recordException(error as Error)
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : 'unknown error',
        })
        throw error
      } finally {
        span.end()
      }
    },
  )
}
